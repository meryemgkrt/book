import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isCheckingAuth: true,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      console.log("=== REGISTER RESPONSE ===");
      console.log("Full data:", data);
      console.log("User object:", data.user);
      console.log("User ID:", data.user?._id);
      console.log("========================");
      
      if (!res.ok) {
        set({ isLoading: false, error: data.message || "Registration failed" });
        throw new Error(data.message || "Registration failed");
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("=== LOGIN RESPONSE ===");
      console.log("Full data:", data);
      console.log("User object:", data.user);
      console.log("User ID:", data.user?._id);
      console.log("=====================");

      if (!res.ok) {
        set({ isLoading: false, error: data.message || "Login failed" });
        throw new Error(data.message || "Login failed");
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Login error:", error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      console.log("=== CHECK AUTH ===");
      console.log("Token:", token ? "exists" : "missing");
      console.log("User data:", user);
      console.log("User ID:", user?._id);
      console.log("==================");

      set({ user, token });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ user: null, token: null });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null, error: null });
    } catch (error) {
      console.error("Logout error:", error);
    }finally{
      set({ isCheckingAuth: false });
    }
  },
}));