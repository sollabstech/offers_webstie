import type { Product } from "@/types";

export interface VendorInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
  category?: string;
}

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const CATEGORY_SLUG_MAP: Record<string, string> = {
  Electronics: "electronics",
  Clothing: "clothing",
  "Home & Garden": "home-garden",
  Sports: "sports",
  Toys: "toys",
  Beauty: "beauty",
  Books: "books",
  Food: "food",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFields(fields: Record<string, any>, id: string): Product {
  const str = (key: string) => fields[key]?.stringValue ?? "";
  const num = (key: string) => Number(fields[key]?.integerValue ?? fields[key]?.doubleValue ?? 0);
  const arr = (key: string): string[] =>
    fields[key]?.arrayValue?.values?.map((v: any) => v.stringValue ?? "") ?? [];

  const category = str("category");
  return {
    id,
    slug: str("slug") || id,
    title: str("name"),
    brand: str("vendorName"),
    vendorId: str("vendorId") || undefined,
    categorySlug: CATEGORY_SLUG_MAP[category] ?? category.toLowerCase().replace(/\s+/g, "-"),
    price: num("price"),
    originalPrice: fields["originalPrice"] ? num("originalPrice") : undefined,
    currency: "INR",
    rating: num("rating"),
    reviewCount: num("reviewCount"),
    images: arr("images").length
      ? arr("images")
      : [`https://placehold.co/400x400/1e293b/f97316?text=${encodeURIComponent(str("name").slice(0, 10))}`],
    description: str("description"),
    specifications: Object.fromEntries(
      Object.entries(fields["specifications"]?.mapValue?.fields ?? {}).map(([k, v]: [string, any]) => [k, v?.stringValue ?? ""])
    ),
    reviews: [],
    stock: num("stock"),
    tags: arr("tags"),
  };
}

async function firestoreQuery(body: object): Promise<any[]> {
  if (!PROJECT_ID || !API_KEY) return [];
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getFirestoreProductBySlug(slug: string): Promise<Product | null> {
  const results = await firestoreQuery({
    structuredQuery: {
      from: [{ collectionId: "products" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "slug" },
          op: "EQUAL",
          value: { stringValue: slug },
        },
      },
      limit: 1,
    },
  });

  const hit = results[0];
  if (!hit?.document) return null;
  const fields = hit.document.fields ?? {};
  const vendorStatus = fields["vendorStatus"]?.stringValue;
  if (vendorStatus && vendorStatus !== "active") return null;
  const name = hit.document.name as string;
  const id = name.split("/").pop() ?? slug;
  return mapFields(fields, id);
}

export async function getVendorById(vendorId: string): Promise<VendorInfo | null> {
  if (!PROJECT_ID || !API_KEY || !vendorId || vendorId === "__offerss__") return null;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/vendors/${vendorId}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields ?? {};
    const s = (k: string) => f[k]?.stringValue ?? "";
    return {
      id: vendorId,
      name: s("name"),
      email: s("email"),
      phone: s("phone"),
      company: s("company"),
      address: s("address") || undefined,
      category: s("category") || undefined,
    };
  } catch {
    return null;
  }
}

export async function getAllFirestoreProducts(): Promise<Product[]> {
  const results = await firestoreQuery({
    structuredQuery: {
      from: [{ collectionId: "products" }],
    },
  });

  return results
    .filter((r: any) => {
      if (!r.document) return false;
      const vendorStatus = r.document.fields?.vendorStatus?.stringValue;
      return !vendorStatus || vendorStatus === "active";
    })
    .map((r: any) => {
      const name = r.document.name as string;
      const id = name.split("/").pop() ?? "";
      return mapFields(r.document.fields ?? {}, id);
    });
}
