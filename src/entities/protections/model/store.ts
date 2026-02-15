import { create } from "zustand";
import supabase from "@/shared/supabase";
import { useAuthStore } from "@/entities/auth/model/store";
import { APP_CONFIG } from "@/shared/config";
import { useSnackbarStore } from "@/shared/model/snackbar/store";

interface ProtectionState {
  protectionsSet: Set<string>;

  fetchProtections: () => Promise<void>;

  submitProtection: (openingId: string) => Promise<void>;
}

const MAX_PROTECTION = APP_CONFIG.DEFAULT_PROTECTION_BUDGET;

export const useProtectionsStore = create<ProtectionState>((set, get) => ({
  protectionsSet: new Set(),

  fetchProtections: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("Попытка достать защиту от неавторизованного пользователя");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("protections")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      if (data) {
        const newState = new Set(
          data.map((protection) => protection.opening_id),
        );

        set({ protectionsSet: newState });
      }
    } catch (error) {
      console.error("Ошибка при получении протекшенов", error);
    }
  },

  submitProtection: async (openingId) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("Попытка достать защиту от неавторизованного пользователя");
      return;
    }

    const prevProtectionSet = new Set(get().protectionsSet);

    const optimisticSet = new Set(prevProtectionSet);

    const isAlreadyProtected = prevProtectionSet.has(openingId);

    if (isAlreadyProtected) {
      optimisticSet.delete(openingId);
    } else {
      if (optimisticSet.size >= MAX_PROTECTION) {
        useSnackbarStore
          .getState()
          .show("Вы истратили свою защиту", "error", 1000);
        return;
      }
      optimisticSet.add(openingId);
    }

    set({ protectionsSet: optimisticSet });

    try {
      if (isAlreadyProtected) {
        const { error } = await supabase
          .from("protections")
          .delete()
          .match({ opening_id: openingId, user_id: userId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("protections")
          .insert({ user_id: userId, opening_id: openingId });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Ошибка при попытке изменить защиту опенинга", error);
      set({ protectionsSet: prevProtectionSet });
    }
  },
}));
