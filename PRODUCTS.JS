
const products = [
  {
    id: 1,
    name: "Watermelon",
    price: 22,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/watermelon.jpg?tr=w-300,h-300",
    discount: 10,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Watermelon", "Red"],
  },
  {
    id: 2,
    name: "Apple",
    price: 5.99,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/apple.jpg?tr=w-300,h-300",
    discount: 5,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Apple", "Red"],
  },
  {
    id: 3,
    name: "Banana",
    price: 54,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/banana.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Banana", "Yellow"],
  },
  {
    id: 4,
    name: "Papaya",
    price: 2.55,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/papaya.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Papaya", "Orange"],
  },
  {
    id: 5,
    name: "Tomato",
    price: 220,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/tomato.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Tomato", "Red"],
  },

  {
    id: 6,
    name: "Cabbage",
    price: 40,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/cabbage.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cabbage", "Green"],
  },

  {
    id: 7,
    name: "Lettuce",
    price: 22,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/lettuce.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Lettuce", "Green"],
  },
  {
    id: 8,
    name: "Red Pepper",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/red-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Red Pepper", "Red"],
  },

  {
    id: 9,
    name: "Chilli Pepper",
    price: 42,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/chilli-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Chilli Pepper", "Red"],
  },
  {
    id: 10,
    name: "Green Pepper",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/green-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Green Pepper", "Green"],
  },
  {
    id: 11,
    name: "Chicken",
    price: 43,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/chicken.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Chicken", "White"],
  },
  {
    id: 12,
    name: "Cow Beef",
    price: 60,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/cow-beef.jpg",
        unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Cow Beef", "Red"],
  },
  {
    id: 13,
    name: "Pork",
    price: 77,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/pork.jpg",
        unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Pork", "Red"],
  },
  {
    id: 14,
    name: "Mutton",
    price: 28,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/mutton.jpg",
    unitOfMeasure: "lb",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Mutton", "Red"],
  },
  {
    id: 15, 
    name: "Pineapple",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/pineapple.jpg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Citrus", "Fresh"]
  },
  {
    id: 16,
    name: "Carrot",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/carrot.jpg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Fresh"]
  }
];

const saveToLocalStorage = async (products) => {
  try {
    const jsonValue = JSON.stringify(products);
    await AsyncStorage.setItem("@products", jsonValue);
    console.log("Products saved to local storage");
    loadFromLocalStorage();
  } catch (e) {
    console.error("Failed to save products to local storage", e);
  }
};
const loadFromLocalStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@products");
    console.log(jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load products from local storage", e);
  }
};
saveToLocalStorage(products);
