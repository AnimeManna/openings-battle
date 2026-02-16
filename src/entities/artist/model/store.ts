import { create } from "zustand";
import { useAuthStore } from "@/entities/auth/model/store";
import supabase from "@/shared/supabase";
import type { Artist } from "./types";

interface AnimeState {
  artistMap: Map<string, Artist>;

  fetchArtists: () => Promise<void>;
}

export const useArtistStore = create<AnimeState>((set, get) => ({
  artistMap: new Map(),

  fetchArtists: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("Попытка получения списка неавторизованным пользователем!");
      return;
    }

    try {
      const { data, error } = await supabase.from("artists").select("id, name");

      if (error) throw error;
      if (!data) {
        console.warn("Empty data");
        return;
      }

      const updateMap = get().artistMap;

      data.forEach((artist) => {
        updateMap.set(artist.id, {
          id: artist.id,
          name: artist.name ?? "",
        });
      });
      console.log(updateMap);
      set({ artistMap: updateMap });
    } catch (error) {
      console.error("Ошибка при получении артистов", error);
    }
  },
}));
