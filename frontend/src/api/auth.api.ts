import axiosInstance from './axios';
import type { User } from '../types';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface MeResponse {
  user: User;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', { name, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const fetchCurrentUser = async (): Promise<MeResponse> => {
  const response = await axiosInstance.get<MeResponse>('/auth/me');
  return response.data;
};
