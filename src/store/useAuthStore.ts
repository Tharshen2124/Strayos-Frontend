// src/store/authStore.ts
import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: "No Value",
  setToken: (token) => {
    // Save the token in Zustand state
    set({ token });

    // Store the token in cookies
    Cookies.set('authToken', token, { expires: 7 }); // Expires in 7 days
  },
  clearToken: () => {
    // Clear the token from Zustand state
    set({ token: null });

    // Remove the token from cookies
    Cookies.remove('authToken');
  },
}));

export default useAuthStore;
