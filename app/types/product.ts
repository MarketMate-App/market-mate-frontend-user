// types.ts
export default interface Product {
    rating: number;
    _id: any;
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    discount: number;
    unitOfMeasure: string;
    category: string;
    tags: string[];
    description?: string;
  }