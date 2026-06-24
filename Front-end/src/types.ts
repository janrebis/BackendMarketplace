export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  userName: string;
}

export type ProductCategory =
  | 'Elektronika'
  | 'OdziezIAkcesoria'
  | 'DomIOgrod'
  | 'Sport'
  | 'Uroda'
  | 'KsiazkiIMultimedia'
  | 'Motoryzacja'
  | 'Zabawki';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  Elektronika: 'Elektronika',
  OdziezIAkcesoria: 'Odzież i akcesoria',
  DomIOgrod: 'Dom i ogród',
  Sport: 'Sport i rekreacja',
  Uroda: 'Uroda i zdrowie',
  KsiazkiIMultimedia: 'Książki i multimedia',
  Motoryzacja: 'Motoryzacja',
  Zabawki: 'Zabawki i dziecko',
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

export interface Product {
  id: number;
  ownerId: string | null;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: ProductCategory;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: ProductCategory;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: ProductCategory;
}

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  buyerId: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}