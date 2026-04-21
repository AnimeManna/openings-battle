import { create } from "zustand";
import { fetchAll } from "@/features/opening-stats/model/helpers";
interface StageStatsState {
  roundStatsMap: Map<string, Map<string, Set<string>>>;
  fetchStageStats: () => Promise<void>;
}

export const useStageStatsStore = create<StageStatsState>((set) => ({
  roundStatsMap: new Map(),
  fetchStageStats: async () => {
    try {
      const data = await fetchAll<{
        opening_id: string;
        round_id: string;
        profiles: { username: string };
        rounds: { stage_id: string };
      }>(
        "round_votes",
        `
      opening_id, round_id, profiles!inner ( username ), rounds!inner (stage_id)`,
      );

      const newMap = new Map();

      data.forEach((roundVote) => {
        let roundMap = newMap.get(roundVote.round_id);
        if (!roundMap) roundMap = new Map();
        let openingSet = roundMap.get(roundVote.opening_id);
        if (!openingSet) openingSet = new Set();
        openingSet.add(roundVote.profiles.username);
        roundMap.set(roundVote.opening_id, openingSet);
        newMap.set(roundVote.round_id, roundMap);
      });

      set({ roundStatsMap: newMap });
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  },
}));
