import axios from 'axios';
import type { AuthUser } from '../types/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

interface LoginPayload {
  username: string;
  password: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthUser> {
  const response = await api.post<AuthUser>('/auth/login', payload);
  return response.data;
}