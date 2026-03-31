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

  const isAllowedToVote = useMemo(
    () =>
      round
        ? round.maxChoices > currentVotesCount && round.status !== "completed"
        : false,
    [round, currentVotesCount],
  );

  return {
    roundVotes,
    isAllowedToVote,
    currentVotesCount,
  };
};
