import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AUTH_TOKEN_KEY } from "../services/api";
import { loginRequest, meRequest } from "../services/authService";
import type { AuthResponse, AuthUser } from "../types/auth";

const AUTH_USER_KEY = "auth_user";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(AUTH_USER_KEY);

      if (!token) {
        if (active) {
          setIsAuthLoading(false);
        }
        return;
      }

      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as AuthUser;
          if (active) {
            setUser(parsed);
          }
        } catch {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }

      try {
        const currentUser = await meRequest();
        if (active) {
          setUser(currentUser);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
        }
      } catch {
        if (active) {
          clearSession();
        }
      } finally {
        if (active) {
          setIsAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, [clearSession]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    const authResponse = await loginRequest({ email, password });

    localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authResponse.user));
    setUser(authResponse.user);

    return authResponse;
  }, []);

  const logout = useCallback(() => {
    clearSession();

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }, [clearSession]);

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
