// store.js
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item: any) => {
    set((state: { cart: any }) => {
      const newCart = [...state.cart, item];
      return { cart: newCart };
    });
  },
  removeFromCart: (itemId: any) => {
    set((state: { cart: any[] }) => {
      const newCart = state.cart.filter(
        (item: { id: any }) => item.id !== itemId
      );
      return { cart: newCart };
    });
  },
  loadCart: () => {
    // No-op since AsyncStorage is removed
  },
  clearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;
