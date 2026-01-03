import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/endpoints';
import { Alert } from 'react-native';

interface AuthContextProps {
  userToken: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const login = async (credentials: any) => {
    try {
        const response = await authAPI.login(credentials);
        const { token } = response.data;
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token);
    } catch (error: any) {
        console.error(error);
        Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        throw error;
    }
  };

  const register = async (userData: any) => {
      try {
          const response = await authAPI.register(userData);
          const { token } = response.data;
          setUserToken(token);
          await AsyncStorage.setItem('userToken', token);
      } catch (error: any) {
        console.error(error);
        Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        throw error;
      }
  }

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      
      if (userToken) {
          // Verify token with backend
          try {
            // Wait for the user to be fetched
            await authAPI.getUser();
            setUserToken(userToken);
          } 
          catch (error) {
            console.log("Token validation failed", error);
            // Token is invalid, remove it
            await AsyncStorage.removeItem('userToken');
            setUserToken(null);
          }
      } else {
          setUserToken(null);
      }
      
      setIsLoading(false);
    } catch (e) {
        console.log(`isLoggedIn error ${e}`);
        setIsLoading(false);
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, register, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
