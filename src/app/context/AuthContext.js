"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // We'll keep router for logout

  const setSession = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('qnect_token', token);
      setUserToken(token);
      setUserEmail(decoded.email);
    } catch (e) {
      console.error("Failed to decode token", e);
      // If token is bad, log them out
      localStorage.removeItem('qnect_token');
      setUserToken(null);
      setUserEmail(null);
    }
  };

  // On load, check if a token is already in localStorage
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('qnect_token');
    if (token) {
      setSession(token);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      setSession(response.data.token);
      // We no longer redirect here. The login page will do it.
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Login Failed');
    }
  };

  const signup = async (userData) => {
    try {
      const response = await registerUser(userData);
      setSession(response.data.token);
      // We no longer redirect here. The signup page will do it.
    } catch (error) { 
      console.error("Signup failed:", error);
      throw new Error(error.response?.data?.message || 'Signup Failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('qnect_token');
    setUserToken(null);
    setUserEmail(null);
    router.push('/'); // Go home on logout
  };

  return (
    <AuthContext.Provider value={{ userToken, userEmail, isLoading, login, signup, logout }}>
          {console.log("api url"+process.env.API_URL)}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};