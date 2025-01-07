// store.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useProductStore = create((set) => ({
  products: [],
  loadProducts: async () => {
    const savedProducts = await AsyncStorage.getItem("@products");
    if (savedProducts) {
      set({ products: JSON.parse(savedProducts) });
    }
  },
}));

export default useProductStore;
