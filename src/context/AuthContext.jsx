import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_URL });

// ─── INTERCEPTORS ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mm_token');
      localStorage.removeItem('mm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Central session save — always use this
  const _save = useCallback((token, userData) => {
    localStorage.setItem('mm_token', token);
    localStorage.setItem('mm_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // ─── AUTH ───────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    _save(data.data.token, data.data.user);
    return data.data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    _save(data.data.token, data.data.user);
    return data.data.user;
  };

  const googleToken = async (accessToken) => {
    const { data } = await api.post('/auth/google-token', { accessToken });
    _save(data.data.token, data.data.user);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    setUser(null);
  };

  // ─── PROFILE ────────────────────────────────────────────
  const updateProfile = async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    // data.data = safeUser object from backend
    const updated = data.data;
    localStorage.setItem('mm_user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  // Upload avatar — sends FormData, returns new avatar URL
  const uploadAvatar = async (file) => {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.post('/auth/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Patch avatar into current user state
    const updated = {
      ...user,
      profile: { ...user.profile, avatar: data.data.avatar },
    };
    localStorage.setItem('mm_user', JSON.stringify(updated));
    setUser(updated);
    return data.data.avatar;
  };

  // Refresh user from server
  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const updated = data.data;
      localStorage.setItem('mm_user', JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch { return user; }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider value={{
      user, login, register, googleToken,
      updateProfile, uploadAvatar, refreshUser,
      logout, isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
