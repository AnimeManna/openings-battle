import { create } from "zustand";
import supabase from "@/shared/supabase";
import type { Profile } from "@/entities/auth/model/types";
import type { Opening } from "@/entities/openings/model/types";
import { fetchAll } from "./helpers";
import type { VoteDTO } from "@/entities/votes/model/types";
import { useOpeningsStore } from "@/entities/openings/model/store";

export type StatOpening = Opening & {
  seedScore: number;
  avgScore: number;
  index: number;
};

interface OpeningStatsState {
  columns: Profile[];
  rows: StatOpening[];
  matrix: Record<string, Record<string, number>>;

  isLoading: boolean;
  fetchOpeningStats: () => Promise<void>;
}

export const useOpeningStatsStore = create<OpeningStatsState>((set) => ({
  columns: [],
  rows: [],
  matrix: {},
  isLoading: false,

  fetchOpeningStats: async () => {
    set({ isLoading: true });

    try {
      const votesData = await fetchAll<VoteDTO>(
        "votes",
        "user_id, opening_id, rate",
      );
      const [profilesRes, metricsRes, stageParticipantsResponse] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .neq("is_service_account", true)
            .order("username"),
          supabase.from("opening_metrics").select("*"),
          supabase.from("stage_participants").select("*"),
        ]);

      if (profilesRes.error) throw profilesRes.error;
      const metricsMap = new Map<string, number>();
      metricsRes.data?.forEach((openingMetric) =>
        metricsMap.set(openingMetric.opening_id, openingMetric.avg_score ?? 0),
      );

      const spMap = new Map<string, number>();
      stageParticipantsResponse.data?.forEach((stageParticipant) => {
        spMap.set(
          stageParticipant.opening_id,
          stageParticipant.seed_score ?? 0,
        );
      });

      const openings = Array.from(
        useOpeningsStore.getState().openingsMap.values(),
      );

      const rows: StatOpening[] = (openings || [])
        .map((op) => ({
          ...op,
          avgScore: metricsMap.get(op.id) ?? 0,
          seedScore: spMap.get(op.id) ?? 0,
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .sort((a, b) => b.seedScore - a.seedScore)
        .map((op, index) => ({ ...op, index: index + 1 }));

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
      console.error("Failed to fetch openings stats:", e);
      set({ isLoading: false });
    }
  },
}));
