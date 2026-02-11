import { useOpeningsStore } from "@/entities/openings/model";
import { useVotesStore } from "@/entities/votes/model";
import { useMemo } from "react";

export const useNextOpening = () => {
  const openings = useOpeningsStore((s) => s.openings);

  const myVotes = useVotesStore((s) => s.myVotes);

  const nextOpening = useMemo(() => {
    return openings.find((op) => !myVotes[op.id]);
  }, [openings, myVotes]);

  return {
    nextOpening,
    isCompleted: !nextOpening,
    total: openings.length,
    votedCount: Object.keys(myVotes).length,
  };
};
