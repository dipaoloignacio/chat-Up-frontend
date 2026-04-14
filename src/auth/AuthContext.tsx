import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthState = {
  userId: string | null;
  name: string | null;
  email: string | null;
  logged: boolean;
  checking: boolean;
};

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialState: AuthState = {
  userId: null,
  name: null,
  email: null,
  logged: false,
  checking: true,
};

export const AuthContext = createContext({} as AuthContextType);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<AuthState>(initialState);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("https://chatup-api.dipaoloproyects.space/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return false;

      document.cookie = `X-Token=${data.token}; path=/`;

      localStorage.setItem("user", JSON.stringify(data.user));

      setAuth({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        logged: true,
        checking: false,
      });

      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    document.cookie = "X-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    localStorage.removeItem("user");
    setAuth({ ...initialState, checking: false });
  };
  const checkAuth = useCallback(() => {
    const hasCookie = document.cookie.includes("X-Token");
    if (!hasCookie) {
      setAuth({ ...initialState, checking: false });
      return;
    }

    // ✅ recuperás el usuario
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setAuth({
      userId: user.id || null,
      name: user.name || null,
      email: user.email || null,
      logged: true,
      checking: false,
    });
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AuthContext value={{ auth, login, logout }}>{children}</AuthContext>;
};
