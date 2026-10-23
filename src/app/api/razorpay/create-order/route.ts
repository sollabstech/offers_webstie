import { NextRequest, NextResponse } from "next/server";
import { getRazorpayConfig } from "@/lib/firebase-server";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR" } = (await req.json()) as {
      amount: number;
      currency?: string;
    };

    // `amount` is in rupees here; Razorpay's minimum is 100 paise (₹1).
    const amountPaise = Math.round(amount * 100);
    if (!Number.isFinite(amountPaise) || amountPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1 (100 paise)." },
        { status: 400 }
      );
    }

    const config = await getRazorpayConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Please add your API keys in the Admin → Settings page." },
        { status: 503 }
      );
    }

    const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    if (!rzpRes.ok) {
      const err = await rzpRes.json().catch(() => ({}));
      const description =
        (err as { error?: { description?: string } }).error?.description ?? "Razorpay order creation failed";
      // 401 from Razorpay = bad/rejected API keys.
      const status = rzpRes.status === 401 ? 401 : rzpRes.status >= 500 ? 500 : rzpRes.status;
      return NextResponse.json({ error: description }, { status });
    }

    const order = (await rzpRes.json()) as { id: string; amount: number; currency: string };

    // Return order details + the public Key ID (never the secret)
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.keyId,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
