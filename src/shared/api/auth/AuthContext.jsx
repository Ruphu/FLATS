import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '@shared/api/auth/authApi';
import { clearStoredAuth, getAuthToken, setAuthToken } from '@shared/api/auth/tokenStorage';

const AuthContext = createContext(null);

const extractToken = (response) =>
  response?.token ??
  response?.accessToken ??
  response?.data?.token ??
  response?.data?.accessToken ??
  null;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAuthToken());

  const applyAuthResponse = (response) => {
    const nextToken = extractToken(response);

    if (!nextToken) {
      throw new Error('Backend did not return a token');
    }

    setAuthToken(nextToken);
    setToken(nextToken);

    return { token: nextToken };
  };

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    return applyAuthResponse(response);
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    return applyAuthResponse(response);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        login,
        logout,
        register,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
