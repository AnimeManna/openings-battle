import { useRoundVotesStore } from "@/entities/round-votes/model/store";
import { useRoundsStore } from "@/entities/rounds/model/store";
import { useMemo } from "react";

export const useRoundVoteStats = (roundId: string) => {
  const round = useRoundsStore((state) => state.roundsMap.get(roundId) ?? null);

  const roundVotes = useRoundVotesStore(
    (state) => state.roundVotesMap.get(roundId) ?? null,
  );

  const currentVotesCount: number = useMemo(
    () => (roundVotes ? roundVotes.size : 0),
    [roundVotes],
  );

  const isRoundCompleted = useMemo(
    () => (round ? round.status === "completed" : false),
    [round],
  );

  const isAllowedToVote = useMemo(
    () => (round ? round.maxChoices > currentVotesCount : false),
    [round, currentVotesCount],
  );

  return {
    roundVotes,
    isRoundCompleted,
    isAllowedToVote,
    currentVotesCount,
  };
};
