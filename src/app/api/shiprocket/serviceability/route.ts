import { NextRequest, NextResponse } from "next/server";
import { checkServiceability, getShiprocketConfig, speedTierForETD, getDocData } from "@/lib/shiprocket-server";
import { PLATFORM_VENDOR_ID } from "@/lib/shiprocket-quote";

interface RawCourier {
  courier_company_id: number;
  courier_name: string;
  rate: number;
  freight_charge: number;
  etd: string;
  cod: number;
}

async function resolvePickupPincode(vendorId: string): Promise<string | null> {
  if (vendorId === PLATFORM_VENDOR_ID) {
    const config = await getShiprocketConfig();
    return config?.pickupPincode || null;
  }
  const vendorData = await getDocData("vendors", vendorId);
  return (vendorData?.pincode as string) || null;
}

// POST { pincode, productId? } — used by the product page's "Check delivery" box.
// Resolves the product's actual vendor pickup location so the quote is real,
// not a generic platform default. Falls back to the platform pickup pincode
// when the product has no vendor (or the vendor has none configured).
export async function POST(req: NextRequest) {
  try {
    const { pincode, productId } = (await req.json()) as { pincode?: string; productId?: string };
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Enter a valid 6-digit pincode." }, { status: 400 });
    }

    let vendorId = PLATFORM_VENDOR_ID;
    let weight = 0.5;
    if (productId) {
      const product = await getDocData("products", productId);
      if (product?.vendorId) vendorId = product.vendorId as string;
      if (product?.weight && product.weight > 0) weight = product.weight as number;
    }

    let pickupPincode = await resolvePickupPincode(vendorId);
    // Vendor has no pickup location set yet — fall back to the platform's so
    // shoppers still get an estimate rather than a hard error.
    if (!pickupPincode && vendorId !== PLATFORM_VENDOR_ID) {
      pickupPincode = await resolvePickupPincode(PLATFORM_VENDOR_ID);
    }
    if (!pickupPincode) {
      return NextResponse.json({ error: "Delivery check is not configured yet." }, { status: 503 });
    }

    const data = (await checkServiceability({
      pickup_postcode: pickupPincode,
      delivery_postcode: pincode,
      weight,
      cod: 1,
    })) as { data?: { available_courier_companies?: RawCourier[] } };

    const raw = data.data?.available_courier_companies ?? [];
    if (raw.length === 0) {
      return NextResponse.json({ serviceable: false });
    }

    const couriers = raw
      .map((c) => ({
        name: c.courier_name,
        rate: Math.round(c.rate ?? c.freight_charge),
        etd: c.etd,
        codAvailable: c.cod === 1,
        speedTier: speedTierForETD(c.etd),
      }))
      .sort((a, b) => new Date(a.etd).getTime() - new Date(b.etd).getTime());

    const fastest = couriers[0];
    const cheapest = [...couriers].sort((a, b) => a.rate - b.rate)[0];
    const codAvailable = couriers.some((c) => c.codAvailable);

    return NextResponse.json({
      serviceable: true,
      estimatedDelivery: fastest.etd,
      codAvailable,
      courierCount: couriers.length,
      fastest,
      cheapest,
    });
  } catch (err) {
    console.error("Shiprocket serviceability error:", err);
    return NextResponse.json({ error: "Could not check delivery for this pincode right now." }, { status: 502 });
  }
}
