import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginRequest } from "../services/authService";
import type { AuthUser } from "../types/auth";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (
    username: string,
    password: string,
    remember: boolean
  ) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    setIsAuthLoading(false);
  }, []);

  const login = useCallback(
    async (
      username: string,
      password: string,
      _remember: boolean
    ): Promise<AuthUser> => {
      const authUser = await loginRequest({ username, password });
      setUser(authUser);
      return authUser;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAuthLoading,
      login,
      logout,
    }),
    [user, isAuthLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
