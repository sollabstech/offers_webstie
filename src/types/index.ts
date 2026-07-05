export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  label: string;
  type: "color" | "size";
  value: string;
  swatch?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  reviews: Review[];
  stock: number;
  badge?: "New" | "Best Seller" | "Deal" | "Limited";
  tags: string[];
}

export interface CartLine {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartLine[];
  address: Address;
  paymentMethod: string;
  subtotal: number;
  total: number;
  placedAt: string;
  status: "Placed" | "Processing" | "Shipped" | "Delivered";
}
