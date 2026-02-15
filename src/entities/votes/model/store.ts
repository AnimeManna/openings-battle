import { create } from "zustand";
import type { Vote } from "./types";
import supabase from "@/shared/supabase";
import { formatVote } from "./formatter";
import { useAuthStore } from "@/entities/auth/model/store";
import { useSnackbarStore } from "@/shared/model/snackbar/store";

interface VotesState {
  votesMap: Map<string, Vote>;

  fetchVotes: (userId: string) => Promise<void>;

  setVotesMap: (votes: Vote[]) => void;

  submitVote: (openingId: string, rate: number) => Promise<void>;
}

export const useVotesStore = create<VotesState>((set, get) => ({
  votesMap: new Map(),

  fetchVotes: async (userId) => {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", userId)
      .order("rate", { ascending: true });
    if (error) console.error("Error when try get votes", error);
    if (data) {
      const formattedVotes = data.map(formatVote);
      get().setVotesMap(formattedVotes);
    }
  },
  setVotesMap: (votes) => {
    const newMap = new Map(get().votesMap);

    votes.forEach((vote) => {
      newMap.set(vote.openingId, vote);
    });

    set({ votesMap: newMap });
  },

  submitVote: async (openingId, rate) => {
    const currentMap = get().votesMap;
    const prevState = currentMap.get(openingId);
    const userId = useAuthStore.getState().profile?.id;

    if (!userId) {
      console.error("Попытка голосования без авторизации");
      return;
    }

    const optimisticMap = new Map(currentMap);

    optimisticMap.set(openingId, { openingId, rate });

    set({ votesMap: optimisticMap });

    try {
      const { error } = await supabase.from("votes").upsert(
        {
          opening_id: openingId,
          rate: rate,
          user_id: userId,
        },
        { onConflict: "user_id, opening_id" },
      );

      if (error) throw error;

      useSnackbarStore
        .getState()
        .show("Ваш голос успешно засчитан", "success", 1000);
    } catch (error) {
      console.error("Ошбика при голосовании", error);
      const rollbackMap = new Map(currentMap);
      if (prevState) {
        rollbackMap.set(openingId, prevState);
      } else {
        rollbackMap.delete(openingId);
      }

      set({ votesMap: rollbackMap });
    }
  },
}));
