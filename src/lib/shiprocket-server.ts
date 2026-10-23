/**
 * Server-side helper for the storefront's Shiprocket touchpoints (delivery
 * estimate on the product page). No "use client" — only used from Route
 * Handlers. Reads the SAME Firestore settings/shiprocket doc the admin panel
 * writes to (both apps point at one Firebase project).
 */
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, type DocumentData } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured() {
  return Boolean(cfg.apiKey && cfg.projectId);
}

function getDb() {
  const app = getApps().length ? getApps()[0] : initializeApp(cfg as object);
  return getFirestore(app);
}

export async function getDocData(collectionName: string, id: string): Promise<DocumentData | null> {
  if (!isConfigured()) return null;
  const snap = await getDoc(doc(getDb(), collectionName, id));
  return snap.exists() ? snap.data() : null;
}

export interface MarginRule {
  marginType: "fixed" | "percentage";
  marginValue: number;
}

export interface ShippingRules {
  defaultMargin: MarginRule;
  codCharge: number;
  minCharge?: number;
  maxCharge?: number;
  vendorMargins?: Record<string, MarginRule>;
  courierMargins?: Record<string, MarginRule>;
}

const DEFAULT_RULES: ShippingRules = { defaultMargin: { marginType: "fixed", marginValue: 0 }, codCharge: 0 };

/** Same Firestore doc (settings/shippingRules) the admin panel writes to. */
export async function getShippingRules(): Promise<ShippingRules> {
  try {
    const data = await getDocData("settings", "shippingRules");
    if (!data) return DEFAULT_RULES;
    return {
      defaultMargin: data.defaultMargin ?? DEFAULT_RULES.defaultMargin,
      codCharge: typeof data.codCharge === "number" ? data.codCharge : 0,
      minCharge: typeof data.minCharge === "number" ? data.minCharge : undefined,
      maxCharge: typeof data.maxCharge === "number" ? data.maxCharge : undefined,
      vendorMargins: data.vendorMargins ?? undefined,
      courierMargins: data.courierMargins ?? undefined,
    };
  } catch {
    return DEFAULT_RULES;
  }
}

function marginAmountFor(rate: number, rule: MarginRule): number {
  return rule.marginType === "percentage" ? Math.round((rate * rule.marginValue) / 100) : rule.marginValue;
}

export interface PricingResult {
  shiprocketRate: number;
  marginType: MarginRule["marginType"];
  marginValue: number;
  marginAmount: number;
  codCharge: number;
  finalCharge: number;
}

/** Mirrors offers_adminal/src/lib/shipping-pricing.ts computeShippingCharge — kept in sync by hand. */
export function computeShippingCharge(
  shiprocketRate: number,
  opts: { vendorId?: string; courierName?: string; isCOD: boolean },
  rules: ShippingRules
): PricingResult {
  const rule: MarginRule =
    (opts.courierName && rules.courierMargins?.[opts.courierName]) ||
    (opts.vendorId && rules.vendorMargins?.[opts.vendorId]) ||
    rules.defaultMargin;
  const marginAmount = Math.max(0, marginAmountFor(shiprocketRate, rule));
  const codCharge = opts.isCOD ? Math.max(0, rules.codCharge || 0) : 0;
  let finalCharge = Math.round(shiprocketRate + marginAmount + codCharge);
  if (rules.minCharge != null) finalCharge = Math.max(finalCharge, rules.minCharge);
  if (rules.maxCharge != null) finalCharge = Math.min(finalCharge, rules.maxCharge);
  return { shiprocketRate, marginType: rule.marginType, marginValue: rule.marginValue, marginAmount, codCharge, finalCharge };
}

export interface ShiprocketConfig {
  email: string;
  password: string;
  pickupPincode: string;
}

export async function getShiprocketConfig(): Promise<ShiprocketConfig | null> {
  if (isConfigured()) {
    try {
      const snap = await getDoc(doc(getDb(), "settings", "shiprocket"));
      if (snap.exists()) {
        const data = snap.data();
        if (data.email && data.password) {
          return {
            email: data.email as string,
            password: data.password as string,
            pickupPincode: (data.pickupPincode as string) ?? "",
          };
        }
      }
    } catch {
      // fall through to env
    }
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (email && password) {
    return { email, password, pickupPincode: process.env.SHIPROCKET_PICKUP_PINCODE ?? "" };
  }
  return null;
}

// ── Minimal auth + serviceability client (mirrors offers_adminal/src/lib/shiprocket.ts) ──

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;
let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

  const config = await getShiprocketConfig();
  if (!config) throw new Error("Shiprocket is not configured.");

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: config.email, password: config.password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.token) {
    throw new Error(`Shiprocket authentication failed: ${body.message ?? res.statusText}`);
  }
  cachedToken = body.token as string;
  cachedTokenExpiresAt = Date.now() + TOKEN_TTL_MS;
  return cachedToken;
}

export async function checkServiceability(params: {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  cod: 0 | 1;
}) {
  const token = await getToken();
  const qs = new URLSearchParams({
    pickup_postcode: params.pickup_postcode,
    delivery_postcode: params.delivery_postcode,
    weight: String(params.weight),
    cod: String(params.cod),
  });
  const res = await fetch(`${BASE_URL}/courier/serviceability/?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message ?? "Serviceability check failed");
  return body;
}

export type DeliverySpeedTier = "express" | "fast" | "standard";

export function speedTierForETD(etd: string): DeliverySpeedTier {
  const days = Math.ceil((new Date(etd).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 2) return "express";
  if (days <= 4) return "fast";
  return "standard";
}
