import { create } from "zustand";
import supabase from "@/shared/supabase";
interface StageStatsState {
  roundStatsMap: Map<string, Map<string, Set<string>>>;
  fetchStageStats: (stageId: string) => Promise<void>;
}

export const useStageStatsStore = create<StageStatsState>((set) => ({
  roundStatsMap: new Map(),
  fetchStageStats: async (stageId) => {
    try {
      const { data, error } = await supabase
        .from("round_votes")
        .select(
          `
      opening_id, round_id, profiles!inner ( username ), rounds!inner (stage_id)`,
        )
        .eq("rounds.stage_id", stageId);

      if (error) throw error;
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
