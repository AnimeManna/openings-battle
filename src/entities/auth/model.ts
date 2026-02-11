import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../shared/firebase";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (username, pin) => {
        try {
          const usersRef = collection(db, "users");
          const q = query(
            usersRef,
            where("id", "==", username),
            where("pin", "==", pin),
          );

          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            return false;
          }

          const userData = snapshot.docs[0].data() as User;

          set({ user: userData, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
