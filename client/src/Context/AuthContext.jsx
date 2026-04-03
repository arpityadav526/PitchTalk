import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../Services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("pitchtalk_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("pitchtalk_user");
      }
    }

    setAuthLoading(false);
  }, []);

  const normalizeAuthResponse = (data) => {
    if (data?.token) return data;
    if (data?.user && data?.token) {
      return { ...data.user, token: data.token };
    }
    return data;
  };

  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    const userData = normalizeAuthResponse(response.data);

    localStorage.setItem("pitchtalk_user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (name, email, password) => {
    const response = await API.post("/auth/register", { name, email, password });
    const userData = normalizeAuthResponse(response.data);

    localStorage.setItem("pitchtalk_user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem("pitchtalk_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);