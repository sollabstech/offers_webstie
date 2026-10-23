/**
 * Checkout-time shipping quote: groups the cart by vendor (Shiprocket ships
 * one pickup location per shipment), checks real serviceability + rates for
 * each group, and applies the admin's pricing rules. No "use client" — used
 * only from Route Handlers.
 */
import { getDocData, getShiprocketConfig, getShippingRules, checkServiceability, computeShippingCharge } from "./shiprocket-server";

export const PLATFORM_VENDOR_ID = "__offerss__";

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface RawCourier {
  courier_company_id: number;
  courier_name: string;
  rate: number;
  freight_charge: number;
  etd: string;
  cod: number;
}

export interface VendorQuote {
  vendorId: string;
  vendorName: string;
  items: QuoteItem[];
  pickupPincode: string;
  deliveryPincode: string;
  weight: number;
  length: number;
  breadth: number;
  height: number;
  serviceable: boolean;
  reason?: string;
  courierName?: string;
  etd?: string;
  shiprocketRate?: number;
  marginType?: "fixed" | "percentage";
  marginValue?: number;
  marginAmount?: number;
  codCharge?: number;
  finalCharge?: number;
}

export interface OrderQuote {
  serviceable: boolean;
  totalShippingCharge: number;
  groups: VendorQuote[];
}

/** Never returns null for pincode — an empty string means "not set up yet" without losing the vendor's real name. */
async function resolvePickupPincode(vendorId: string): Promise<string> {
  if (vendorId === PLATFORM_VENDOR_ID) {
    const config = await getShiprocketConfig();
    return config?.pickupPincode ?? "";
  }
  const vendorData = await getDocData("vendors", vendorId);
  return (vendorData?.pincode as string) ?? "";
}

/**
 * Quote shipping for a cart. Groups items by vendor, checks live Shiprocket
 * serviceability + the cheapest courier's rate for each group, and applies
 * the admin's pricing rules. `serviceable` is true only if every group is.
 */
export async function quoteOrderShipping(
  items: QuoteItem[],
  deliveryPincode: string,
  isCOD: boolean
): Promise<OrderQuote> {
  const productDocs = await Promise.all(items.map((i) => getDocData("products", i.productId)));

  const byVendor = new Map<string, { items: QuoteItem[]; vendorName: string; weight: number; length: number; breadth: number }>();
  items.forEach((item, i) => {
    const product = productDocs[i];
    const vendorId = (product?.vendorId as string) || PLATFORM_VENDOR_ID;
    const vendorName = vendorId === PLATFORM_VENDOR_ID ? "Offerss.com" : (product?.vendorName as string) || vendorId;
    const bucket = byVendor.get(vendorId) ?? { items: [], vendorName, weight: 0, length: 0, breadth: 0 };
    bucket.items.push(item);
    const unitWeight = product?.weight && product.weight > 0 ? (product.weight as number) : 0.5;
    bucket.weight += unitWeight * item.quantity;
    bucket.length = Math.max(bucket.length, product?.height && product.height > 0 ? (product.height as number) : 10);
    bucket.breadth = Math.max(bucket.breadth, product?.width && product.width > 0 ? (product.width as number) : 10);
    byVendor.set(vendorId, bucket);
  });

  const rules = await getShippingRules();
  const groups: VendorQuote[] = [];

  for (const [vendorId, bucket] of byVendor) {
    const pickupPincode = await resolvePickupPincode(vendorId);
    const base: VendorQuote = {
      vendorId,
      vendorName: bucket.vendorName,
      items: bucket.items,
      pickupPincode,
      deliveryPincode,
      weight: Math.max(bucket.weight, 0.1),
      length: bucket.length,
      breadth: bucket.breadth,
      height: 5,
      serviceable: false,
    };

    if (!pickupPincode) {
      groups.push({ ...base, reason: `Shipping isn't set up yet for ${base.vendorName}.` });
      continue;
    }

    try {
      const data = (await checkServiceability({
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        weight: base.weight,
        cod: isCOD ? 1 : 0,
      })) as { data?: { available_courier_companies?: RawCourier[] } };

      const couriers = (data.data?.available_courier_companies ?? []).sort(
        (a, b) => (a.rate ?? a.freight_charge) - (b.rate ?? b.freight_charge)
      );

      if (couriers.length === 0) {
        groups.push({ ...base, reason: `Not deliverable to ${deliveryPincode} for ${base.vendorName}'s items.` });
        continue;
      }

      const cheapest = couriers[0];
      const pricing = computeShippingCharge(cheapest.rate ?? cheapest.freight_charge, { vendorId, courierName: cheapest.courier_name, isCOD }, rules);

      groups.push({
        ...base,
        serviceable: true,
        courierName: cheapest.courier_name,
        etd: cheapest.etd,
        ...pricing,
      });
    } catch {
      groups.push({ ...base, reason: "Could not check delivery availability right now." });
    }
  }

  return {
    serviceable: groups.every((g) => g.serviceable),
    totalShippingCharge: groups.reduce((sum, g) => sum + (g.finalCharge ?? 0), 0),
    groups,
  };
}
