export type UserRole = 'PROMOTOR' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  token: string;
}