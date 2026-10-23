import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getRazorpayConfig } from "@/lib/firebase-server";

// crypto is a Node builtin — force the Node.js runtime (not Edge).
export const runtime = "nodejs";

/**
 * Verify a Razorpay payment signature.
 * signature = HMAC_SHA256(`${order_id}|${payment_id}`, KEY_SECRET)
 * The order is only safe to mark as paid when this matches.
 */
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      (await req.json()) as {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
      };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing razorpay_order_id, razorpay_payment_id or razorpay_signature" },
        { status: 400 }
      );
    }

    const config = await getRazorpayConfig();
    if (!config) {
      return NextResponse.json(
        { verified: false, error: "Razorpay is not configured. Please add your API keys in the Admin → Settings page." },
        { status: 503 }
      );
    }

    const expected = crypto
      .createHmac("sha256", config.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const provided = Buffer.from(razorpay_signature, "utf8");
    const expectedBuf = Buffer.from(expected, "utf8");
    const valid =
      provided.length === expectedBuf.length &&
      crypto.timingSafeEqual(provided, expectedBuf);

    if (!valid) {
      // Signature mismatch — do NOT treat this payment as complete.
      return NextResponse.json({ verified: false, error: "Signature verification failed" }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ verified: false, error: "Internal server error" }, { status: 500 });
  }
}
