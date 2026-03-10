"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { APP_CONFIG } from "@/lib/config";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          // Validate quantity
          if (quantity < APP_CONFIG.cart.minQuantity || quantity > APP_CONFIG.cart.maxQuantity) {
            console.warn(`Invalid quantity: ${quantity}. Must be between ${APP_CONFIG.cart.minQuantity} and ${APP_CONFIG.cart.maxQuantity}`);
            return state;
          }

          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > APP_CONFIG.cart.maxQuantity) {
              console.warn(`Cannot add ${quantity} items. Maximum quantity is ${APP_CONFIG.cart.maxQuantity}`);
              return state;
            }
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: newQuantity }
                  : cartItem
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          // Validate quantity
          if (quantity < 0 || quantity > APP_CONFIG.cart.maxQuantity) {
            console.warn(`Invalid quantity: ${quantity}. Must be between 0 and ${APP_CONFIG.cart.maxQuantity}`);
            return state;
          }

          return {
            items:
              quantity === 0
                ? state.items.filter((item) => item.productId !== productId)
                : state.items.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                  ),
          };
        }),
      clearCart: () => set({ items: [] }),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: APP_CONFIG.cart.storageKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
