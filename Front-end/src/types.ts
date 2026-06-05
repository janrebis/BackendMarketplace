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

export interface Product {
  id: number;
  ownerId: string | null;
  name: string;
  price: number;
  description: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  description: string;
}

// Orders are not yet implemented on the backend.
// When the backend adds POST /api/orders, this type will be used.
export interface Order {
  id: number;
  buyerId: string;
  productId: number;
  quantity: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}