import { create } from 'zustand';

// Safely read persisted user from localStorage
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Set user — also persists to localStorage
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  // Set token
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  // Set loading
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Logout — clear both token and user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
