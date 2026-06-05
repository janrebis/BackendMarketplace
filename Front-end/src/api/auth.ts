import api from './client';
import type { AuthResponse, User } from '../types';

export const register = (email: string, password: string) =>
  api.post<string>('/users/register', { email, password });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/users/login', { email, password });

export const getMe = () =>
  api.get<User>('/users/me');