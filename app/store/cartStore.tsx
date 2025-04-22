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
      const cartMap = new Map(
        state.cart.map((cartItem) => [cartItem.id, cartItem])
      );
      const existingItem = cartMap.get(item.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        cartMap.set(item.id, {
          ...existingItem,
          quantity: newQuantity,
          total: existingItem.price * newQuantity,
        });
      } else {
        cartMap.set(item.id, { ...item, total: item.price * item.quantity });
      }

      return { cart: Array.from(cartMap.values()) };
    }),
  removeFromCart: (itemId: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),
  updateQuantity: (itemId: string, quantity: number) =>
    set((state) => {
      const cartMap = new Map(
        state.cart.map((cartItem) => [cartItem.id, cartItem])
      );
      const existingItem = cartMap.get(itemId);

      if (existingItem) {
        cartMap.set(itemId, {
          ...existingItem,
          quantity,
          total: existingItem.price * quantity,
        });
      }

      return { cart: Array.from(cartMap.values()) };
    }),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
