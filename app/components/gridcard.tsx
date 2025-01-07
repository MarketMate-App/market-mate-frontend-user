import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../store/cartStore";
import { ImageSourcePropType } from "react-native";
import { Link } from "expo-router";

interface GridcardProps {
  name: string;
  price: number;
  imageUrl: string;
  discount?: number;
  unitOfMeasure?: string;
  category?: string;
  tags?: string[];
  productId?: number;
}
type CartState = {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
};
const GridcardComponent: React.FC<GridcardProps> = ({
  productId,
  name,
  price,
  imageUrl,
  discount,
  unitOfMeasure,
}) => {
  const [heartFilled, setHeartFilled] = React.useState(false);
  const [quantity, setQuantity] = React.useState(0);

  const product = {
    id: productId,
    name: name,
    price: price,
    imageUrl: imageUrl,
    discount: discount,
    unitOfMeasure: unitOfMeasure,
    quantity: quantity,
    instructions: "",
    total: price * quantity,
  };

  React.useEffect(() => {
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity = quantity;
      existingProduct.total = price * quantity;
    } else if (quantity > 0) {
      addToCart(product);
    } else if (quantity === 0 && productId !== undefined) {
      removeFromCart(productId);
    }
  }, [quantity]);
  const cart = useCartStore((state) => (state as CartState).cart);
  const addToCart = useCartStore((state) => (state as CartState).addToCart);
  const removeFromCart = useCartStore(
    (state) => (state as CartState).removeFromCart
  );
  return (
    <View className="p-4 border-hairline border-gray-300 rounded-3xl w-[180px] mr-3">
      <Link href={`/products/${productId}`} asChild>
        <ImageBackground
          source={{ uri: imageUrl }}
          className="h-[100px] w-full mb-4"
          resizeMode="center"
        >
          <AntDesign
            name={heartFilled ? "heart" : "hearto"}
            size={20}
            color={heartFilled ? "red" : "gray"}
            onPress={() => setHeartFilled(!heartFilled)}
          />
        </ImageBackground>
      </Link>

      <View>
        <Text
          className="text-black text-base mb-4"
          style={{ fontFamily: "Unbounded Regular" }}
        >
          {name}
        </Text>
        <Text
          className="text-gray-500 text-sm"
          style={{ fontFamily: "Unbounded Light" }}
        >
          1 {unitOfMeasure}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text
            className="text-lg relative"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            ₵{Math.floor(price)}
            <Text style={{ fontSize: 12, fontFamily: "Unbounded Regular" }}>
              .
              {price.toFixed(2).split(".")[1] === "00"
                ? "00"
                : price.toFixed(2).split(".")[1]}
            </Text>
          </Text>
          <View>
            {quantity === 0 ? (
              <View
                className="p-3 rounded-full bg-[#2BCC5A20]"
                onTouchEnd={() => {
                  setQuantity(1);
                  addToCart(product);
                }}
              >
                <Ionicons name="basket" size={24} color={"#2BCC5A"} />
              </View>
            ) : (
              <View className="flex-row items-center bg-gray-50 p-2 rounded-full">
                <Entypo
                  name="minus"
                  size={24}
                  color={"black"}
                  onPress={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    } else {
                      setQuantity(0);
                      if (productId !== undefined) {
                        removeFromCart(productId);
                      }
                    }
                  }}
                />
                <Text className="mx-2">{quantity}</Text>
                <Entypo
                  name="plus"
                  size={24}
                  color={"black"}
                  onPress={() => setQuantity(quantity + 1)}
                />
              </View>
            )}
            {/* {quantity > 0 && (
              <Text className="text-green-500 mt-2 text-sm">Added to cart</Text>
            )} */}
          </View>
        </View>
        <View className="mt-2">
          <Text
            className="text-gray-500"
            style={{ fontFamily: "Gilroy Medium" }}
          >
            Total: ₵{(price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GridcardComponent;
