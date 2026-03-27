import { create } from "zustand";
import { useAuthStore } from "@/entities/auth/model/store";
import supabase from "@/shared/supabase";
import type { Artist } from "./types";
import { formatArtist } from "./formatter";
import { notifier } from "@/shared/lib/notifier";

interface ArtistState {
  artistMap: Map<string, Artist>;

  fetchArtists: () => Promise<void>;
  createArtist: (payload: {
    name: string;
  }) => Promise<{ data: { id: string; name: string } | null }>;
}

export const useArtistStore = create<ArtistState>((set, get) => ({
  artistMap: new Map(),

  fetchArtists: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.error("Попытка получения списка неавторизованным пользователем!");
      return;
    }

    try {
      const { data, error } = await supabase.from("artists").select("*");

      if (error) throw error;
      if (!data) {
        console.warn("Empty data");
        return;
      }

      const updateMap = new Map(get().artistMap);

      data.forEach((artist) => {
        updateMap.set(artist.id, formatArtist(artist));
      });
      set({ artistMap: updateMap });
    } catch (error) {
      console.error("Ошибка при получении артистов", error);
    }
  },
  createArtist: async ({ name }) => {
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
        .from("artists")
        .insert({
          name,
          created_by: userId,
        })
        .select()
        .single();

      if (error && !data) throw error;

      const newAnimeData = formatArtist(data);
      const newMap = new Map(get().artistMap);

      newMap.set(data.id, newAnimeData);

      set({ artistMap: newMap });
      notifier.success("Исполнителя успешно добавленно");
      return {
        data: newAnimeData,
      };
    } catch (error) {
      console.error("Ошибка при добавлении артиста:", error);
      notifier.error("Ошибка при создании, обратитесь к админу");
      return { data: null };
    }
  },
}));
