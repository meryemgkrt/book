import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ localhost yerine bilgisayarının IP adresini yaz
const API_URL = "http://localhost:3000"; // Kendi IP'ni buraya yaz!

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        set({ isLoading: false });
        throw new Error(data.message || "Registration failed");
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (email, password) => {},

  logout: () => {},
}));