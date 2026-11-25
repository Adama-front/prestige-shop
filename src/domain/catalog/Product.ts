export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number | null;
    count: number;
  };
  discount?: number;
  isNew?: boolean;
  createdAt?: string;
  stock?: number;
}
