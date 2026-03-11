"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/utils/authService";

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Sign in function
  const signIn = (userData) => {
    const signedInUser = authService.signIn(userData);
    setUser(signedInUser);
    return signedInUser;
  };

  // Sign out function
  const signOut = () => {
    authService.signOut();
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    authService.saveUser(updated);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    isLoggedIn: user !== null,
    isLoading,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
