import { create } from "zustand";

interface UIState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Language
  language: string;
  setLanguage: (lang: string) => void;

  // Global loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Theme — default light
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    set({ theme });
  },

  // Language — default English
  language: "en",
  setLanguage: (lang) => set({ language: lang }),

  // Global loading state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));