import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, refreshToken as apiRefreshToken } from "../api/api"; // Import your API login function

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true); // To indicate initial loading/token check

  // Check for existing tokens in localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
      // Optionally, you might want to verify the token's validity here
    }
    setLoading(false);
  }, []); // Run only once on mount

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Call your backend login endpoint
      const response = await apiLogin({ username, password });
      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setAccessToken(access);
      setRefreshToken(refresh);
      setIsAuthenticated(true);
      setLoading(false);
      return true; // Indicate success
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setLoading(false);
      throw error; // Re-throw for handling in the component
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Optionally, invalidate token on the backend
  };

  // Optional: Auto-refresh token logic (more complex)
  // useEffect(() => {
  //   let interval;
  //   if (isAuthenticated && refreshToken) {
  //     // Set up an interval to refresh the token before it expires
  //     // You'd need to decode the access token to get its expiry time
  //     // For simplicity, this is omitted here, but crucial for long sessions
  //     interval = setInterval(() => {
  //       // Call apiRefreshToken
  //       // If successful, update access token in state and localStorage
  //       // If failed, logout
  //     }, /* Calculate refresh interval */);
  //   }
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [isAuthenticated, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
