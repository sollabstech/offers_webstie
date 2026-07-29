"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

const EMPTY = { name: "", college: "", phone: "", role: "", reason: "" };

export default function CareersPage() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />

      <h1 className="mt-4 mb-2 text-3xl font-bold text-text">Join Our Team</h1>
      <p className="mb-8 text-text-muted leading-relaxed">
        We're building the future of e-commerce in India. If you're passionate about technology, business, or customer experience — we'd love to hear from you.
      </p>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-14 text-center">
          <CheckCircle size={48} className="text-success" />
          <h2 className="text-xl font-semibold text-text">Application Received!</h2>
          <p className="max-w-sm text-sm text-text-muted">
            Thank you, <strong>{form.name}</strong>! We'll review your application and reach out to you at <strong>{form.phone}</strong> if there's a good fit.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(EMPTY); }}
            className="mt-2 text-sm text-primary underline hover:text-primary/80"
          >
            Submit another application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-6 space-y-5">
          <h2 className="font-semibold text-text text-lg">Application Form</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Full Name *</span>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-text">Phone Number *</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-text">College / University *</span>
            <input
              required
              value={form.college}
              onChange={(e) => set("college", e.target.value)}
              placeholder="e.g. IIT Bombay / Mumbai University"
              className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-text">Role You're Applying For *</span>
            <select
              required
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface text-text"
            >
              <option value="">Select a role</option>
              <option>Software Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Product Manager</option>
              <option>UI/UX Designer</option>
              <option>Marketing & Growth</option>
              <option>Vendor Relations</option>
              <option>Customer Support</option>
              <option>Data Analyst</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-text">Why do you want to join Offerss? *</span>
            <textarea
              required
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
              rows={4}
              placeholder="Tell us about your motivation, skills, and what you'd bring to the team..."
              className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-surface resize-none"
            />
          </label>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Submitting…" : "Submit Application"}
          </Button>
        </form>
      )}
    </main>
  );
}
