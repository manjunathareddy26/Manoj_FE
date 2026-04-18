import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Set user
  setUser: (user) => set({ user }),

  // Set token
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  // Set loading
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
