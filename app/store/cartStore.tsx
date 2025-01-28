// store.js
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item: { id: string; quantity: any }) => {
    set((state: { cart: any[] }) => {
      const existingItem = state.cart.find(
        (cartItem: { id: string }) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.total = existingItem.price * existingItem.quantity;
        return { cart: [...state.cart] };
      } else {
        return { cart: [...state.cart, item] };
      }
    });
  },
  removeFromCart: (itemId: any) => {
    set((state: { cart: any[] }) => ({
      cart: state.cart.filter((item: { id: any }) => item.id !== itemId),
    }));
  },
  updateQuantity: (itemId: any, quantity: number) => {
    set((state: { cart: any[] }) => {
      const newCart = state.cart.map((item: { id: any; price: number }) =>
        item.id === itemId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      );
      return { cart: newCart };
    });
  },
  clearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;
