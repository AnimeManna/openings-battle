import { create } from "zustand";
import supabase from "@/shared/supabase";
import type { RoundVote } from "./types";
import { notifier } from "@/shared/lib/notifier";
import { formatRoundVote } from "./formatter";

type OpeningId = string;

interface RoundVotesStore {
  roundVotesMap: Map<OpeningId, RoundVote>;

  fetchAllRoundVotes: (userId: string) => Promise<void>;

  submitRoundVote: (roundVote: RoundVote) => Promise<void>;
}

export const useRoundVotesStore = create<RoundVotesStore>((set, get) => ({
  roundVotesMap: new Map(),

  fetchAllRoundVotes: async (userId: string) => {
    if (!userId) {
      console.error("Попытка голосования без авторизации");
      return;
    }

    const { data, error } = await supabase
      .from("round_votes")
      .select("*")
      .eq("user_id", userId);
    if (error) console.error("Error when try get rounds_votes", error);
    if (data) {
      const formattedData = data.map(formatRoundVote);
      const newMap = new Map();

      formattedData.forEach((roundVote) => {
        newMap.set(roundVote.openingId, roundVote);
      });

      set({ roundVotesMap: newMap });
    }
  },
  submitRoundVote: async (newRoundVote) => {
    const { userId, roundId, openingId } = newRoundVote;
    const currentMap = get().roundVotesMap;
    const prevState = currentMap.get(openingId);

    const optimisticMap = new Map(currentMap);

    optimisticMap.set(openingId, newRoundVote);

    set({ roundVotesMap: optimisticMap });

    try {
      const { error } = await supabase.from("round_votes").insert({
        opening_id: openingId,
        round_id: roundId,
        user_id: userId,
      });
      notifier.success("Ваш голос успешно засчитан");
      if (error) throw error;
    } catch (error) {
      console.error("Ошбика при голосовании", error);
      notifier.error("Произошла ошибка, попробуйте позже");
      const rollbackMap = new Map(currentMap);
      if (prevState) {
        rollbackMap.set(openingId, prevState);
      } else {
        rollbackMap.delete(openingId);
      }

      set({ roundVotesMap: rollbackMap });
    }
  },
}));
