// CartComponent.js
import React from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { useCartStore } from "../store/cartStore";

type CartState = {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  loadCart: () => void;
};

const CartComponent = () => {
  const cart = useCartStore((state) => (state as CartState).cart);
  const addToCart = useCartStore((state) => (state as CartState).addToCart);
  const removeFromCart = useCartStore(
    (state) => (state as CartState).removeFromCart
  );
  const clearCart = useCartStore((state) => (state as CartState).clearCart);
  const loadCart = useCartStore((state) => (state as CartState).loadCart);
  return (
    <ScrollView>
      <Text>Cart Items:</Text>
      {cart.map((item) => (
        <View key={item.id}>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
          <Text>{item.quantity}</Text>
          <Text>{item.total}</Text>
          <Button
            title="Remove from Cart"
            onPress={() => removeFromCart(item.id)}
          />
        </View>
      ))}
      <Button title="Clear Cart" onPress={() => clearCart()} />
    </ScrollView>
  );
};

export default CartComponent;
