import api from './client';
import type { Order, CreateOrderRequest } from '../types';

export const placeOrder = (data: CreateOrderRequest) =>
  api.post<Order>('/orders', data);

export const getMyOrders = () =>
  api.get<Order[]>('/orders');

export const getOrderById = (id: number) =>
  api.get<Order>(`/orders/${id}`);
