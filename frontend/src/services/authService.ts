import { api } from "./api";
import type { AuthResponse, AuthUser } from "../types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordResponse {
  message: string;
  resetLink: string | null;
}

interface ResetPasswordResponse {
  message: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function meRequest(): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/me");
  return response.data;
}

export async function forgotPasswordRequest(
  email: string
): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", {
    email,
  });
  return response.data;
}

export async function resetPasswordRequest(
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
}
