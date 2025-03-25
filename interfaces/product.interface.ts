export interface IProduct {
  id: string; // UUID string
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  stock: number;
  price: number; // Decimal type, but represented as a number in JS/TS
  rating: number; // Decimal type, but represented as a number in JS/TS
  numberOfReviews: number;
  isFeatured: boolean;
  banner?: string | null; // Optional field, can be null
  createdAt: Date; // DateTime field, should be represented as a JS Date object
}
