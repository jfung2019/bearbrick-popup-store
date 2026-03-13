/**
 * Custom hook to consolidate cart store selectors
 * Provides a cleaner API and better performance
 */

import { useCartStore } from "@/store/useCartStore";
import { useCallback, useEffect, useState } from "react";

export function useCart() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useCartStore.persist.hasHydrated());

    const unsubscribeHydrate = useCartStore.persist.onHydrate(() => {
      setHasHydrated(false);
    });

    const unsubscribeFinishHydration = useCartStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => {
      unsubscribeHydrate();
      unsubscribeFinishHydration();
    };
  }, []);

  // Memoized selectors
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const hydratedItems = hasHydrated ? items : [];

  // Computed values
  const totalItems = hydratedItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = hydratedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const isEmpty = hydratedItems.length === 0;

  // Enhanced actions with feedback
  const addItemWithFeedback = useCallback(
    (product: Parameters<typeof addItem>[0], quantity?: number) => {
      addItem(product, quantity);
      return { success: true, message: "Item added to cart" };
    },
    [addItem]
  );

  const updateQuantityWithValidation = useCallback(
    (id: number, quantity: number) => {
      if (quantity < 0) {
        return { success: false, message: "Invalid quantity" };
      }
      updateQuantity(id, quantity);
      return { success: true, message: "Quantity updated" };
    },
    [updateQuantity]
  );

  const removeItemWithFeedback = useCallback(
    (id: number) => {
      removeItem(id);
      return { success: true, message: "Item removed from cart" };
    },
    [removeItem]
  );

  const clearCartWithFeedback = useCallback(() => {
    clearCart();
    return { success: true, message: "Cart cleared" };
  }, [clearCart]);

  return {
    // State
    items: hydratedItems,
    totalItems,
    subtotal,
    isEmpty,
    hasHydrated,

    // Actions
    addItem: addItemWithFeedback,
    removeItem: removeItemWithFeedback,
    updateQuantity: updateQuantityWithValidation,
    clearCart: clearCartWithFeedback,

    // Raw actions (for cases where feedback is not needed)
    rawActions: {
      addItem: addItem,
      removeItem: removeItem,
      updateQuantity: updateQuantity,
      clearCart: clearCart,
    },
  };
}
