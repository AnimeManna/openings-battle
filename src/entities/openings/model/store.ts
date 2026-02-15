import { create } from "zustand";
import type { Opening, SortedOpeningDTO } from "./types";
import supabase from "@/shared/supabase";
import { formatSortedOpening } from "./formatter";
import { useAuthStore } from "@/entities/auth/model/store";

// const DEFAULT_ITEMS_PER_PAGE = 50;

interface OpeningsState {
  openingsMap: Map<string, Opening>;
  openings: Opening[];

  page: number;
  isLoading: boolean;

  isOpeningsExhausted: boolean;

  fetchSortedOpenings: (page: number) => Promise<void>;
  setOpeningsMap: (openings: Opening[]) => void;
}

export const useOpeningsStore = create<OpeningsState>((set, get) => ({
  openingsMap: new Map(),
  openings: [],

  isOpeningsExhausted: false,

  page: 1,
  isLoading: false,

  fetchSortedOpenings: async (page) => {
    if (get().isLoading) return;
    set({ isLoading: true });

    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      console.error("Попытка получения списка неавторизованным пользователем!");
      return;
    }
    try {
      const { data, error } = await supabase.rpc("get_sorted_openings", {
        p_user_id: userId,
      });
      if (error) throw error;

      const formattedData = (data as SortedOpeningDTO[]).map(
        formatSortedOpening,
      );

      set({ page });
      get().setOpeningsMap(formattedData);
    } catch (error) {
      console.error("Error when try get playlist", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setOpeningsMap: (openings) => {
    const newMap = new Map(get().openingsMap);

    openings.forEach((opening) => {
      if (newMap.get(opening.id)) {
        return;
      }
      newMap.set(opening.id, opening);
    });

    const newOpenings = Array.from(newMap.values());

    set({ openingsMap: newMap, openings: newOpenings });
  },
}));
