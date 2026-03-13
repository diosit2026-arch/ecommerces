import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => {
        // Simulate login
        set({
          user: {
            id: 'u1',
            name: userData.name || 'Demo User',
            email: userData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email || 'demo'}`
          },
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }));
      }
    }),
    {
      name: 'user-storage',
    }
  )
);
