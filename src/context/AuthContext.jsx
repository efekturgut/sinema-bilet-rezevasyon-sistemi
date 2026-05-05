import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoadingAuth(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/auth/login", {
        email,
        password,
      });

      const loggedInUser = response.data.user;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Giriş başarısız.",
      };
    }
  };
  
const register = async (name, email, password) => {
  const response = await axios.post("https://sinema-bilet-rezevasyon-sistemi-production.up.railway.app/api/auth/register", {
    name,
    email,
    password,
  });

  const registeredUser = response.data.user;
  setUser(registeredUser);
  localStorage.setItem("user", JSON.stringify(registeredUser));

  return { success: true };
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    loadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);