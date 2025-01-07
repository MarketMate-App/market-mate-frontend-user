// store.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: async (item: any) => {
    set((state: { cart: any }) => {
      const newCart = [...state.cart, item];
      AsyncStorage.setItem("cart", JSON.stringify(newCart)); // Persist to AsyncStorage
      return { cart: newCart };
    });
  },
  removeFromCart: async (itemId: any) => {
    set((state: { cart: any[] }) => {
      const newCart = state.cart.filter(
        (item: { id: any }) => item.id !== itemId
      );
      AsyncStorage.setItem("cart", JSON.stringify(newCart)); // Persist to AsyncStorage
      return { cart: newCart };
    });
  },
  loadCart: async () => {
    const savedCart = await AsyncStorage.getItem("cart");
    if (savedCart) {
      set({ cart: JSON.parse(savedCart) });
    }
  },
  clearCart: async () => {
    set({ cart: [] });
    AsyncStorage.removeItem("cart"); // Clear from AsyncStorage
  },
}));

export default useCartStore;
