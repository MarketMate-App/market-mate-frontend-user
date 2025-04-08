// types.ts
export default interface Product {
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