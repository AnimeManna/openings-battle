import { create } from "zustand";
import type { Round } from "./types";
import supabase from "@/shared/supabase";
import { formatRound } from "./formatter";
interface RoundsState {
  roundsMap: Map<string, Round>;
  fetchRounds: (stageId: string) => Promise<void>;
}

export const useRoundsStore = create<RoundsState>((set) => ({
  roundsMap: new Map(),
  fetchRounds: async (stageId: string) => {
    const { data } = await supabase
      .from("rounds")
      .select(
        "*, opening_ids:round_participants!round_participants_round_id_fkey(opening_id)",
      )
      .eq("stage_id", stageId);
    if (!data) return;
    const formattedData = data.map(formatRound);

    const newMap = new Map();

    formattedData.forEach((round) => {
      newMap.set(round.id, round);
    });

    set({ roundsMap: newMap });

    return;
  },
}));
