import { create } from "zustand";
import type { Profile } from "@/entities/auth/model/types";
import supabase from "@/shared/supabase";
import type { Opening } from "@/entities/openings/model/types";

type StatOpening = Opening & {
  avgScore: number;
};

interface AdminStatsState {
  allProfiles: Profile[];
  allOpenings: StatOpening[];
  matrix: Record<string, Record<string, number>>;
  isLoading: boolean;

  fetchAdminData: () => Promise<void>;
}

export const useAdminStatsStore = create<AdminStatsState>((set) => ({
  allOpenings: [],
  matrix: {},
  allProfiles: [],
  isLoading: false,

  fetchAdminData: async () => {
    set({ isLoading: true });

    try {
      const [votesData, metricsData] = await Promise.all([
        supabase.from("votes").select("*, user_id(*), opening_id(*, anime(*))"),
        supabase.from("opening_metrics").select("*"),
      ]);

      if (votesData.error) throw votesData.error;
      if (metricsData.error) throw metricsData.error;

      if (votesData.data && metricsData.data) {
        const matrix: Record<string, Record<string, number>> = {};
        const openingsMap: Record<string, StatOpening> = {};
        const allProfiles: Record<string, Profile> = {};

        votesData.data.forEach((vote) => {
          if (!openingsMap[vote.opening_id.id]) {
            openingsMap[vote.opening_id.id] = {
              ...(typeof vote.opening_id === "object"
                ? vote.opening_id
                : ({} as Opening)),
              anime: {
                id: vote.opening_id.anime.id,
                title: vote.opening_id.anime.english_title ?? "",
              },
              avgScore:
                metricsData.data.find(
                  (metric) => metric.opening_id === vote.opening_id.id,
                )?.avg_score ?? 0,
            };
          }

          if (!allProfiles[vote.user_id.id]) {
            allProfiles[vote.user_id.id] =
              typeof vote.user_id === "object" ? vote.user_id : ({} as Profile);
          }

          if (!matrix[vote.opening_id.id]) {
            matrix[vote.opening_id.id] = {};
          }
          matrix[vote.opening_id.id][vote.user_id.id] = vote.rate ?? 0;
        });

        set({
          allProfiles: Object.values(allProfiles),
          allOpenings: Object.values(openingsMap),
          matrix,
          isLoading: false,
        });
      }
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
}));
