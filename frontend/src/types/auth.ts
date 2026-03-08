export type UserRole = "PROMOTER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}
