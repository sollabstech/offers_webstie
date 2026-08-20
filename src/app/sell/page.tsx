"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Store,
  FileCheck,
  FileText,
  Package,
  ShieldCheck,
  Rocket,
} from "lucide-react";

/* ─── Step definitions ─────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Registration",   icon: Store },
  { id: 2, label: "Documents",      icon: FileCheck },
  { id: 3, label: "Agreement",      icon: FileText },
  { id: 4, label: "Product Upload", icon: Package },
  { id: 5, label: "Quality Review", icon: ShieldCheck },
  { id: 6, label: "Go Live!",       icon: Rocket },
];

/* ─── Small shared components ──────────────────────────────── */
function Field({
  label, name, type = "text", required = false, placeholder = "", value, onChange,
}: {
  label: string; name: string; type?: string; required?: boolean;
  placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-text">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-text">{label}</label>
      <label
        htmlFor={name}
        className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-3 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
      >
        <Upload size={16} />
        <span>Click to upload</span>
        <input id={name} type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
      </label>
    </div>
  );
}

/* ─── Step panels ───────────────────────────────────────────── */
function Step1({ form, setForm }: { form: Record<string, string>; setForm: (k: string, v: string) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Business Name"    name="businessName"   required value={form.businessName   ?? ""} onChange={(v) => setForm("businessName", v)} />
      <Field label="Contact Person"   name="contactPerson"  required value={form.contactPerson  ?? ""} onChange={(v) => setForm("contactPerson", v)} />
      <Field label="Mobile Number"    name="mobile"         required type="tel" value={form.mobile        ?? ""} onChange={(v) => setForm("mobile", v)} />
      <Field label="Email ID"         name="email"          required type="email" value={form.email          ?? ""} onChange={(v) => setForm("email", v)} />
      <Field label="GST Number"       name="gst"            placeholder="If applicable" value={form.gst            ?? ""} onChange={(v) => setForm("gst", v)} />
      <Field label="PAN Card Number"  name="pan"            required value={form.pan            ?? ""} onChange={(v) => setForm("pan", v)} />
      <Field label="Aadhaar Number"   name="aadhaar"        required value={form.aadhaar        ?? ""} onChange={(v) => setForm("aadhaar", v)} />
      <Field label="Bank Account No." name="bankAccount"    required value={form.bankAccount    ?? ""} onChange={(v) => setForm("bankAccount", v)} />
      <div className="sm:col-span-2">
        <Field label="Pickup Address"  name="pickupAddress"  required value={form.pickupAddress  ?? ""} onChange={(v) => setForm("pickupAddress", v)} />
      </div>
      <div className="sm:col-span-2">
        <Field label="Return Address"  name="returnAddress"  required value={form.returnAddress  ?? ""} onChange={(v) => setForm("returnAddress", v)} />
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">Upload clear copies of the following documents for verification. All documents must be valid and legible.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FileField label="GST Certificate (if applicable)" name="doc_gst" />
        <FileField label="PAN Card"                         name="doc_pan" />
        <FileField label="Cancelled Cheque / Bank Proof"   name="doc_bank" />
        <FileField label="Business Proof"                   name="doc_business" />
        <FileField label="Identity Proof (Aadhaar / Passport)" name="doc_id" />
      </div>
      <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
        <p className="text-sm font-semibold text-yellow-800">⏳ Verification Status: <span className="font-bold">Pending</span></p>
        <p className="mt-1 text-xs text-yellow-700">Our team will review your documents within 24–48 hours. You'll receive an email update.</p>
      </div>
    </div>
  );
}

function Step3({ agreed, setAgreed }: { agreed: boolean; setAgreed: (v: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="h-72 overflow-y-auto rounded-xl border border-border bg-white p-5 text-sm text-text-muted leading-relaxed space-y-3">
        <p className="font-bold text-text text-base">OFFERSS.COM SELLER AGREEMENT</p>
        {[
          ["1. Commission Terms", "Offerss.com deducts a category-based commission from each sale before settlement. Fashion & Beauty: 25%, Electronics & Footwear: 10%, Grocery: 6%. Commission rates may be revised with prior written notice."],
          ["2. Return Policy", "Sellers must accept eligible returns as per Offerss.com's Return Policy. Refunds are processed to the customer and commission is adjusted accordingly."],
          ["3. Shipping Policy", "Orders must be dispatched within the agreed SLA. Products must be packed securely. Sellers are responsible for accurate weight and dimensions to avoid shipping disputes."],
          ["4. Prohibited Products", "Sellers shall not list counterfeit goods, illegal items, hazardous materials, or products restricted by law or Offerss.com policies."],
          ["5. Payment Cycle", "Payments are settled every 7 or 15 days after confirmed delivery, after deducting applicable commission, gateway charges, and taxes."],
          ["6. Marketplace Rules", "Sellers must maintain accurate inventory, genuine products, and comply with all applicable laws. Fraud, excessive complaints, or policy violations may result in account suspension."],
          ["7. Seller Responsibilities", "Supply genuine products, maintain accurate inventory, dispatch orders on time, pack securely, comply with applicable laws, provide accurate listings, and handle warranty obligations where applicable."],
          ["8. Intellectual Property", "Sellers confirm they have the right to use all product images, brand names, logos, and descriptions provided for listing on Offerss.com."],
        ].map(([heading, body]) => (
          <div key={heading}>
            <p className="font-semibold text-text">{heading}</p>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white p-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 accent-primary"
        />
        <span className="text-sm text-text">
          I have read and agree to the <strong>Offerss.com Seller Agreement</strong>, including commission terms, return policy, shipping policy, prohibited products, payment cycle, and marketplace rules.
        </span>
      </label>
    </div>
  );
}

function Step4({ form, setForm }: { form: Record<string, string>; setForm: (k: string, v: string) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">Upload your first product. You can add more products from your seller dashboard after registration.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-text block mb-1">Product Images <span className="text-red-500">*</span></label>
          <label htmlFor="product_images" className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-8 text-center text-sm text-text-muted hover:border-primary hover:text-primary transition-colors">
            <Upload size={28} />
            <span className="font-medium">Drag & drop or click to upload images</span>
            <span className="text-xs">JPG, PNG up to 5MB each. Min 4 images recommended.</span>
            <input id="product_images" type="file" multiple accept="image/*" className="sr-only" />
          </label>
        </div>
        <div className="sm:col-span-2">
          <Field label="Product Title" name="productTitle" required value={form.productTitle ?? ""} onChange={(v) => setForm("productTitle", v)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="productDesc" className="text-sm font-medium text-text block mb-1">Description <span className="text-red-500">*</span></label>
          <textarea
            id="productDesc"
            rows={3}
            value={form.productDesc ?? ""}
            onChange={(e) => setForm("productDesc", e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Field label="Brand"          name="brand"        required value={form.brand        ?? ""} onChange={(v) => setForm("brand", v)} />
        <Field label="SKU"            name="sku"          required value={form.sku          ?? ""} onChange={(v) => setForm("sku", v)} />
        <Field label="MRP (₹)"        name="mrp"          required type="number" value={form.mrp          ?? ""} onChange={(v) => setForm("mrp", v)} />
        <Field label="Offer Price (₹)"name="offerPrice"   required type="number" value={form.offerPrice   ?? ""} onChange={(v) => setForm("offerPrice", v)} />
        <Field label="Stock Quantity" name="stock"        required type="number" value={form.stock        ?? ""} onChange={(v) => setForm("stock", v)} />
        <Field label="Weight (grams)" name="weight"       required type="number" value={form.weight       ?? ""} onChange={(v) => setForm("weight", v)} />
        <Field label="Length (cm)"    name="length"       type="number" value={form.length       ?? ""} onChange={(v) => setForm("length", v)} />
        <Field label="Width (cm)"     name="width"        type="number" value={form.width        ?? ""} onChange={(v) => setForm("width", v)} />
        <Field label="Height (cm)"    name="height"       type="number" value={form.height       ?? ""} onChange={(v) => setForm("height", v)} />
      </div>
    </div>
  );
}

function Step5() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Our quality team reviews every product before it goes live. Here's what we check:</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["🖼️ Image Quality", "Clear, high-resolution images on white background preferred"],
          ["📝 Product Title",  "Accurate, descriptive, no keyword stuffing"],
          ["📂 Category",       "Product is correctly categorised"],
          ["💰 Pricing",        "Competitive and not misleading"],
          ["🔍 Duplicate Check","No duplicate listings on the platform"],
          ["📋 Policy Compliance","Product meets all Offerss.com listing guidelines"],
        ].map(([title, desc]) => (
          <div key={String(title)} className="rounded-xl border border-border bg-white p-4">
            <p className="font-semibold text-text text-sm">{title}</p>
            <p className="text-xs text-text-muted mt-1">{String(desc)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
        ℹ️ Review usually completes within <strong>24–48 hours</strong>. You'll receive an email notification once your product is approved or if any changes are needed.
      </div>
    </div>
  );
}

function Step6() {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 size={52} className="text-green-500" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-text">You're All Set! 🎉</h3>
        <p className="mt-2 text-text-muted max-w-md">
          Your seller account has been created and your product is under review. Once approved, it will be searchable by millions of customers on Offerss.com.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 w-full max-w-lg text-sm">
        {[
          ["📦", "Products Uploaded", "1"],
          ["⏳", "Review Status",     "Pending"],
          ["💳", "Payment Cycle",     "7 days"],
        ].map(([icon, label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-white p-4">
            <p className="text-2xl">{icon}</p>
            <p className="text-xs text-text-muted mt-1">{String(label)}</p>
            <p className="font-bold text-text">{String(value)}</p>
          </div>
        ))}
      </div>
      <Link href="/" className="rounded-full bg-accent px-8 py-3 font-semibold text-white hover:bg-accent-dark transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function SellPage() {
  const [step, setStep] = useState(1);
  const [form, setFormState] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setForm = (key: string, value: string) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 3 && !agreed) return false;
    return true;
  };

  const handleNext = () => {
    if (step < 6) setStep((s) => s + 1);
    else setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent mb-3">
          🛍️ Sell on Offerss.com
        </span>
        <h1 className="text-3xl font-bold text-text">Start Selling Today</h1>
        <p className="mt-2 text-text-muted">Reach millions of customers across India. Complete onboarding in 6 simple steps.</p>
      </div>

      {/* Step progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* connector line */}
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-0" />
          <div
            className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500 -z-0"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map(({ id, label, icon: Icon }) => (
            <div key={id} className="flex flex-col items-center gap-1 z-10">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  id < step
                    ? "bg-primary border-primary text-white"
                    : id === step
                    ? "bg-white border-primary text-primary shadow-md"
                    : "bg-white border-border text-text-muted"
                }`}
              >
                {id < step ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${id === step ? "text-primary" : "text-text-muted"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-primary sm:hidden">
          Step {step}: {STEPS[step - 1].label}
        </p>
      </div>

      {/* Step card */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-bold text-text">
          Step {step}: {STEPS[step - 1].label}
        </h2>

        {step === 1 && <Step1 form={form} setForm={setForm} />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 agreed={agreed} setAgreed={setAgreed} />}
        {step === 4 && <Step4 form={form} setForm={setForm} />}
        {step === 5 && <Step5 />}
        {step === 6 && <Step6 />}

        {/* Navigation buttons */}
        {step < 6 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm font-medium text-text transition hover:bg-surface-alt disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-50"
            >
              {step === 5 ? "Submit & Finish" : "Continue"} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Why sell section */}
      {step === 1 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3 text-center">
          {[
            ["🚀", "Easy Onboarding",     "Get started in minutes with our guided setup"],
            ["💰", "Competitive Rates",   "Low commission starting at just 6%"],
            ["📦", "Hassle-free Shipping","We handle logistics and customer support"],
          ].map(([icon, title, desc]) => (
            <div key={String(title)} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-3xl mb-2">{icon}</p>
              <p className="font-semibold text-text text-sm">{String(title)}</p>
              <p className="text-xs text-text-muted mt-1">{String(desc)}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
