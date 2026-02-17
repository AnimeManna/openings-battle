import { create } from "zustand";
import supabase from "@/shared/supabase";
import type { Profile } from "@/entities/auth/model/types";
import type { OpeningDTO } from "@/entities/openings/model/types";
import { fetchAll } from "./helpers";
import type { VoteDTO } from "@/entities/votes/model/types";

export type StatOpening = OpeningDTO & {
  avgScore: number;
  animeTitle: string;
};

interface AdminStatsState {
  columns: Profile[];
  rows: StatOpening[];
  matrix: Record<string, Record<string, number>>;

  isLoading: boolean;
  fetchAdminData: () => Promise<void>;
}

export const useAdminStatsStore = create<AdminStatsState>((set) => ({
  columns: [],
  rows: [],
  matrix: {},
  isLoading: false,

  fetchAdminData: async () => {
    set({ isLoading: true });

    try {
      const votesData = await fetchAll<VoteDTO>(
        "votes",
        "user_id, opening_id, rate",
      );
      const [profilesRes, openingsRes, metricsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("username"),
        supabase.from("openings").select("*, anime(*)"),
        supabase.from("opening_metrics").select("*"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (openingsRes.error) throw openingsRes.error;
      const metricsMap = new Map<string, number>();
      metricsRes.data?.forEach((m) =>
        metricsMap.set(m.opening_id, m.avg_score ?? 0),
      );

      const rows: StatOpening[] = (openingsRes.data || []).map((op) => ({
        ...op,
        animeTitle: Array.isArray(op.anime)
          ? (op.anime[0]?.english_title ?? "")
          : op.anime?.english_title || "No Anime",
        avgScore: metricsMap.get(op.id) ?? 0,
      }));

      // 4. СОБИРАЕМ СТОЛБЦЫ (Profiles)
      const columns = profilesRes.data || [];

      const matrix: Record<string, Record<string, number>> = {};

      votesData?.forEach((vote) => {
        const opId = vote.opening_id as unknown as string;
        const userId = vote.user_id as unknown as string;

        if (!matrix[opId]) {
          matrix[opId] = {};
        }
        matrix[opId][userId] = vote.rate ?? 0;
      });

      set({
        rows,
        columns,
        matrix,
        isLoading: false,
      });
    } catch (e) {
      console.error("Failed to fetch admin stats:", e);
      set({ isLoading: false });
    }
  },
}));
