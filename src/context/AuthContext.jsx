import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authService,
  decodeJwt,
  setUnauthorizedCallback,
  TOKEN_STORAGE_KEY
} from '../services/authApi';
import { isSafeHttpUrl, sanitizePlainText } from '../utils/security';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => authService.getToken());
  const [user, setUser] = useState(() => authService.getUser());
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Register Axios Response Interceptor 401 handler (Experiment 22f)
  useEffect(() => {
    setUnauthorizedCallback((message) => {
      setToken(null);
      setUser(null);
      setSessionExpiredMessage(message);
    });
  }, []);

  // Update token expiration countdown timer
  useEffect(() => {
    if (!token) {
      setTimeRemaining(null);
      return;
    }

    const checkTimer = () => {
      const decoded = decodeJwt(token);
      if (decoded?.exp) {
        const remaining = decoded.exp - Math.floor(Date.now() / 1000);
        if (remaining <= 0) {
          setTimeRemaining(0);
          authService.logout();
          setToken(null);
          setUser(null);
          setSessionExpiredMessage('Your authentication token has expired. Please sign in again.');
        } else {
          setTimeRemaining(remaining);
        }
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [token]);

  // a) Login using auth API
  const login = async (emailOrId, password) => {
    try {
      const res = await authService.login(emailOrId, password, 120);
      setToken(res.token);
      setUser(res.user);
      setSessionExpiredMessage(null);
      return { success: true, user: res.user, token: res.token };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (accountDetails) => {
    try {
      return await authService.register(accountDetails);
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // e) Logout and token removal
  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    setTimeRemaining(null);
    setSessionExpiredMessage(null);
  };

  const updateProfile = (updatedFields) => {
    const safeFields = Object.fromEntries(Object.entries(updatedFields || {}).map(([key, value]) => [
      key,
      typeof value === 'string' ? sanitizePlainText(value, key === 'bio' ? 1000 : 254) : value,
    ]));
    if (safeFields.avatar && !isSafeHttpUrl(safeFields.avatar)) {
      return { success: false, error: 'Profile image URL must use HTTP or HTTPS.' };
    }
    setUser(prev => {
      const updated = { ...prev, ...safeFields };
      localStorage.setItem('eduvantage_user_info', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  const forceExpire = () => {
    const expired = authService.forceExpireToken();
    setToken(expired);
    setTimeRemaining(0);
  };

  const isAuthenticated = Boolean(token && !authService.isExpired(token) && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        timeRemaining,
        sessionExpiredMessage,
        setSessionExpiredMessage,
        login,
        register,
        logout,
        updateProfile,
        forceExpire,
        decodedToken: token ? decodeJwt(token) : null,
        defaultCredentials: {
          emailOrId: "alex.johnson@elearn.edu",
          password: "Password123!"
        },
        adminCredentials: {
          emailOrId: "admin@eduvantage.edu",
          password: "Admin123!"
        }
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
