import { create } from "zustand";
import supabase from "@/shared/supabase";
import type { RoundVote } from "./types";
import { notifier } from "@/shared/lib/notifier";
import { formatRoundVote } from "./formatter";

interface RoundVotesStore {
  roundVotesMap: Map<string, Set<string>>;

  fetchAllRoundVotes: (userId: string) => Promise<void>;

  submitRoundVote: (roundVote: RoundVote) => Promise<void>;

  removeVote: (roundVote: RoundVote) => Promise<void>;
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
        const roundSet: Set<string> =
          newMap.get(roundVote.roundId) ?? new Set();

        newMap.set(roundVote.roundId, roundSet.add(roundVote.openingId));
      });

      console.log(newMap);

      set({ roundVotesMap: newMap });
    }
  },
  submitRoundVote: async (newRoundVote) => {
    const { userId, roundId, openingId } = newRoundVote;
    const currentMap = get().roundVotesMap;

    const optimisticMap = new Map(currentMap);
    const roundSet = currentMap.get(roundId);
    const optimisticSet = new Set(roundSet);

    optimisticMap.set(roundId, optimisticSet.add(openingId));

    set({ roundVotesMap: optimisticMap });

    try {
      const { error } = await supabase.from("round_votes").insert({
        opening_id: openingId,
        round_id: roundId,
        user_id: userId,
      });
      if (error) throw error;
      notifier.success("Ваш голос успешно засчитан");
    } catch (error) {
      console.error("Ошбика при голосовании", error);
      notifier.error("Произошла ошибка, попробуйте позже");

      set({ roundVotesMap: currentMap });
    }
  },

  removeVote: async ({ openingId, roundId, userId }) => {
    const currentMap = get().roundVotesMap;

    const optimisticMap = new Map(currentMap);

    const roundSet = currentMap.get(roundId);

    if (!roundSet) {
      notifier.info("Не удалось отменить голос");
      return;
    }

    const optimisticSet = new Set(roundSet);

    optimisticSet.delete(openingId);

    optimisticMap.set(roundId, optimisticSet);

    set({ roundVotesMap: optimisticMap });

    try {
      const { error } = await supabase.from("round_votes").delete().match({
        opening_id: openingId,
        user_id: userId,
        round_id: roundId,
      });
      if (error) throw error;
      notifier.success("Ваш голос успешно удален");
    } catch (error) {
      console.error("Ошбика при голосовании", error);
      notifier.error("Произошла ошибка, попробуйте позже");

      set({ roundVotesMap: currentMap });
    }
  },
}));
