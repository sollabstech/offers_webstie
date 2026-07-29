"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/types";

interface AddressState {
  address: Address | null;
  setAddress: (address: Address) => void;
  clearAddress: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      clearAddress: () => set({ address: null }),
    }),
    { name: "offerss-address" }
  )
);
