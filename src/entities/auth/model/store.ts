import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import supabase from "@/shared/supabase";
import type { Profile, Role } from "./types";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface AuthProfile extends Profile {
  role: Role | null;
}

interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  isAuth: boolean;
  isLoading: boolean;

  signUp: (
    email: string,
    password: string,
    username: string,
    role: Role,
  ) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

interface SupabaseJwtPayload extends JwtPayload {
  user_metadata: {
    role?: Role;
    username?: string;
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuth: false,
  isLoading: true,

  checkSession: async () => {
    set({ isLoading: true });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      const jwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
      const role = jwt.user_metadata.role;

      set({
        user: session.user,
        profile: { ...(profile as Profile), role: role ?? "player" },
        isAuth: true,
        isLoading: false,
      });
    } else {
      set({ user: null, profile: null, isAuth: false, isLoading: false });
    }
  },

  signUp: async (email, password, username, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
      },
    });

    if (!error && data.user) {
      await get().checkSession();
    }

    return { error };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      await get().checkSession();
    }
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAuth: false });
  },
}));
