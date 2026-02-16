import { create } from "zustand";
import type { Anime } from "./types";
import { useAuthStore } from "@/entities/auth/model/store";
import supabase from "@/shared/supabase";

interface AnimeState {
  animeMap: Map<string, Anime>;

  fetchAnime: () => Promise<void>;
}

export const useAnimeStore = create<AnimeState>((set, get) => ({
  animeMap: new Map(),

  fetchAnime: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("Попытка получения списка неавторизованным пользователем!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("anime")
        .select("id, english_title, japanese_title, russian_title");

      if (error) throw error;
      if (!data) {
        console.warn("Empty data");
        return;
      }

      const updateMap = get().animeMap;

      data.forEach((anime) => {
        updateMap.set(anime.id, {
          id: anime.id,
          english_title: anime.english_title ?? "",
          japanese_title: anime.japanese_title ?? "",
          russian_title: anime.russian_title ?? "",
        });
      });
      console.log(updateMap);
      set({ animeMap: updateMap });
    } catch (error) {
      console.error("Ошибка при получении аниме", error);
    }
  },
}));
