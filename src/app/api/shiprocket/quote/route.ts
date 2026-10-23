import { NextRequest, NextResponse } from "next/server";
import { quoteOrderShipping, type QuoteItem } from "@/lib/shiprocket-quote";

// POST { items: [{productId,productName,quantity,price}], deliveryPincode, isCOD }
// Checkout-time shipping quote: real serviceability + rate + admin margin, per vendor.
export async function POST(req: NextRequest) {
  try {
    const { items, deliveryPincode, isCOD } = (await req.json()) as {
      items?: QuoteItem[];
      deliveryPincode?: string;
      isCOD?: boolean;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }
    if (!deliveryPincode || !/^\d{6}$/.test(deliveryPincode)) {
      return NextResponse.json({ error: "A valid 6-digit delivery pincode is required" }, { status: 400 });
    }

    const quote = await quoteOrderShipping(items, deliveryPincode, Boolean(isCOD));
    return NextResponse.json(quote);
  } catch (err) {
    console.error("Shiprocket quote error:", err);
    return NextResponse.json({ error: "Could not calculate shipping right now." }, { status: 502 });
  }
}
