import { create } from "zustand";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  total?: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item: CartItem) =>
    set((state) => {
      const index = state.cart.findIndex((cartItem) => cartItem.id === item.id);
      if (index !== -1) {
        const updatedCart = [...state.cart];
        const existingItem = updatedCart[index];
        const newQuantity = existingItem.quantity + item.quantity;
        updatedCart[index] = {
          ...existingItem,
          quantity: newQuantity,
          total: existingItem.price * newQuantity,
        };
        return { cart: updatedCart };
      } else {
        return {
          cart: [...state.cart, { ...item, total: item.price * item.quantity }],
        };
      }
    }),
  removeFromCart: (itemId: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),
  updateQuantity: (itemId: string, quantity: number) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === itemId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      );
      return { cart: updatedCart };
    }),
  clearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;
