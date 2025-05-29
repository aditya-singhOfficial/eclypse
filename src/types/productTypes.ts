// Product interface definitions for backend API integration

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  details?: string[];
  category?: string;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  count?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}
