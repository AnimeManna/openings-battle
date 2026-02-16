import { create } from "zustand";
import type { Opening, SortedOpeningDTO } from "./types";
import supabase from "@/shared/supabase";
import { formatSortedOpening } from "./formatter";
import { useAuthStore } from "@/entities/auth/model/store";
import { useSnackbarStore } from "@/shared/model/snackbar/store";

// const DEFAULT_ITEMS_PER_PAGE = 50;

interface OpeningsState {
  openingsMap: Map<string, Opening>;
  openings: Opening[];

  page: number;
  isLoading: boolean;

  isOpeningsExhausted: boolean;

  fetchSortedOpenings: (page: number) => Promise<void>;
  setOpeningsMap: (openings: Opening[]) => void;

  addOpening: (payload: {
    url: string;
    title: string;
    animeId: string;
    seasonNum: number;
    openingNum: number;
    artistIds: string[];
  }) => Promise<void>;
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
  addOpening: async ({
    url,
    title,
    animeId,
    seasonNum,
    openingNum,
    artistIds,
  }) => {
    const userId = useAuthStore.getState().user?.id;
    const { show } = useSnackbarStore.getState();
    if (!userId) {
      show("Попытка получения списка неавторизованным пользователем!", "error");
    }

    try {
      const { data: opening, error: createError } = await supabase
        .from("openings")
        .insert({
          title: title,
          anime: animeId,
          season_num: seasonNum,
          opening_num: openingNum,
          created_by: userId,
        })
        .select()
        .single();

      if (!opening && createError) throw createError;

      const mediaPromise = supabase
        .from("openings_media")
        .insert({ opening_id: opening.id, youtube_url_main: url });

      const artistInserts = artistIds.map((artistId) => ({
        opening_id: opening.id,
        artist_id: artistId,
      }));

      const artistsPromise =
        artistIds.length > 0
          ? supabase.from("openings_artists").insert(artistInserts)
          : Promise.resolve({ error: null });

      const [mediaResult, artistsResult] = await Promise.all([
        mediaPromise,
        artistsPromise,
      ]);

      if (mediaResult.error)
        throw new Error(`Media Error: ${mediaResult.error.message}`);
      if (artistsResult.error)
        throw new Error(`Artists Error: ${artistsResult.error.message}`);

      show("Опенинг успешно добавлен", "success");

      get().fetchSortedOpenings(1);
    } catch (error) {
      console.error("Ошибка при добавлении артиста:", error);
      show("Ошибка при создании, обратитесь к админу", "error");
    }
  },
}));
