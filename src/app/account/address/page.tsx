"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/ui/Button";
import { useAddressStore } from "@/store/addressStore";
import type { Address } from "@/types";

const EMPTY: Address = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
};

export default function AddressPage() {
  const { address, setAddress, clearAddress } = useAddressStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Address>(address ?? EMPTY);

  const set = (field: keyof Address, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(form);
    setEditing(false);
  };

  const handleEdit = () => {
    setForm(address ?? EMPTY);
    setEditing(true);
  };

  const handleRemove = () => {
    clearAddress();
    setEditing(false);
    setForm(EMPTY);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Your Account", href: "/account" },
          { label: "Addresses" },
        ]}
      />
      <h1 className="mb-6 text-2xl font-semibold text-text">Your Addresses</h1>

      {/* Saved address card */}
      {address && !editing && (
        <div className="mb-6 rounded-lg border-2 border-primary bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="text-sm text-text leading-relaxed">
                <p className="font-semibold text-base">{address.fullName}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="text-text-muted mt-1">Phone: {address.phone}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">
              Default
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-text hover:bg-surface-alt"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!address && !editing && (
        <div className="mb-6 rounded-lg border-2 border-dashed border-border bg-surface p-10 text-center">
          <MapPin size={36} className="mx-auto mb-3 text-text-muted" />
          <p className="mb-1 font-medium text-text">No address saved yet</p>
          <p className="mb-5 text-sm text-text-muted">Add your delivery address so checkout is faster next time.</p>
          <Button onClick={() => { setForm(EMPTY); setEditing(true); }}>
            <Plus size={15} className="mr-1 inline" /> Add Address
          </Button>
        </div>
      )}

      {/* Add new address button when address exists */}
      {address && !editing && (
        <button
          onClick={() => { setForm(EMPTY); setEditing(true); }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
        >
          <Plus size={16} /> Add a new address
        </button>
      )}

      {/* Form */}
      {editing && (
        <form onSubmit={handleSave} className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 font-semibold text-text">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-text">Full name *</span>
              <input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-text">Address line 1 *</span>
              <input required value={form.line1} onChange={(e) => set("line1", e.target.value)}
                placeholder="House / Flat / Block No., Street"
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-text">Address line 2 <span className="text-text-muted font-normal">(optional)</span></span>
              <input value={form.line2} onChange={(e) => set("line2", e.target.value)}
                placeholder="Area / Locality / Landmark"
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">City *</span>
              <input required value={form.city} onChange={(e) => set("city", e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">State *</span>
              <input required value={form.state} onChange={(e) => set("state", e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">Pincode *</span>
              <input required value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-text">Phone *</span>
              <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <div className="mt-5 flex gap-3">
            <Button variant="secondary" type="button" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      )}
    </main>
  );
}
