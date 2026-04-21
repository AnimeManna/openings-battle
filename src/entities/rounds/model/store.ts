import { create } from "zustand";
import type { Round } from "./types";
import supabase from "@/shared/supabase";
import { formatRound } from "./formatter";
interface RoundsState {
  roundsMap: Map<string, Round>;
  fetchRounds: (userId: string, stageId: string) => Promise<void>;
  currentStageId: string | null;
}

export const useRoundsStore = create<RoundsState>((set) => ({
  roundsMap: new Map(),
  currentStageId: null,
  fetchRounds: async (userId: string, stageId: string) => {
    const { data } = await supabase.rpc("get_sorted_rounds", {
      p_stage_id: stageId,
      p_user_id: userId,
    });
    if (!data) return;
    const formattedData = data.map(formatRound);

    console.log(stageId, formattedData);

    const newMap = new Map();

    formattedData.forEach((round) => {
      newMap.set(round.id, round);
    });

    set({ roundsMap: newMap, currentStageId: stageId });

    return;
  },
}));
