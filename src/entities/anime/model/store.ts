import { create } from "zustand";
import type { Anime } from "./types";
import { useAuthStore } from "@/entities/auth/model/store";
import supabase from "@/shared/supabase";
import { formatAnime } from "./formatter";
import { notifier } from "@/shared/lib/notifier";

interface AnimeState {
  animeMap: Map<string, Anime>;

  fetchAnime: () => Promise<void>;

  createAnime: (payload: {
    english_title: string;
    japanese_title?: string;
    russian_title?: string;
  }) => Promise<{
    data: { id: string; english_title: string } | null;
  }>;
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
      const { data, error } = await supabase.from("anime").select("*");

      if (error) throw error;
      if (!data) {
        console.warn("Empty data");
        return;
      }

      const updateMap = new Map(get().animeMap);

      data.forEach((anime) => {
        updateMap.set(anime.id, formatAnime(anime));
      });
      set({ animeMap: updateMap });
    } catch (error) {
      console.error("Ошибка при получении аниме", error);
    }
  },

  createAnime: async ({ english_title, japanese_title, russian_title }) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      notifier.error(
        "Попытка получения списка неавторизованным пользователем!",
      );

      return {
        data: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("anime")
        .insert({
          english_title,
          japanese_title: japanese_title ?? null,
          russian_title: russian_title ?? null,
          created_by: userId,
        })
        .select()
        .single();

      if (error && !data) throw error;

      const newAnimeData = formatAnime(data);
      const newMap = new Map(get().animeMap);

      newMap.set(data.id, newAnimeData);

      set({ animeMap: newMap });
      notifier.success("Аниме успешно добавленно");
      return {
        data: newAnimeData,
      };
    } catch (error) {
      console.error("Ошибка при создании аниме:", error);
      notifier.error("Ошибка при создании, обратитесь к админу");
      return { data: null };
    }
  },
}));
