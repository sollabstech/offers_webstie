"use client";

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, getDocs,
  query, orderBy, onSnapshot, type Unsubscribe,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getDb() {
  if (!isConfigured()) return null;
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig as object);
  return getFirestore(app);
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export interface FirestoreOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  total: number;
  shippingAddress: string;
  address: object;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function writeOrder(order: FirestoreOrder): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "orders", order.id), order);
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface FirestoreUser {
  id: string;
  phone: string;
  name: string;
  email: string;
  status: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
  lastLoginAt: string;
  avatar: string;
}

export async function writeUser(user: FirestoreUser): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, "users", user.id), user, { merge: true });
}

// ─── Products (read from Firestore — written by admin) ───────────────────────

export interface FirestoreProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  vendorName: string;
  stock: number;
  sold: number;
  status: string;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export function listenFirestoreProducts(
  cb: (products: FirestoreProduct[]) => void
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;
  return onSnapshot(
    query(collection(db, "products"), orderBy("createdAt", "desc")),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProduct)))
  );
}
