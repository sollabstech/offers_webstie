"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    { name: "offerss-orders" }
  )
);
