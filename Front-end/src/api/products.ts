import api from './client';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types';

export const getProducts = () =>
  api.get<Product[]>('/products');

export const getProductById = (id: number) =>
  api.get<Product>(`/products/${id}`);

export const createProduct = (data: CreateProductRequest) =>
  api.post<{ id: number }>('/products', data);

export const updateProduct = (id: number, data: UpdateProductRequest) =>
  api.put<Product>(`/products/${id}`, data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`);