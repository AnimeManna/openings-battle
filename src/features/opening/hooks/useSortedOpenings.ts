import { useMemo } from "react";
import { useOpeningsStore } from "@/entities/openings/model";
import { useVotesStore } from "@/entities/votes/model";

export const useSortedOpenings = () => {
  const openings = useOpeningsStore((s) => s.openings);
  const myVotes = useVotesStore((s) => s.myVotes);

  const sortedOpenings = useMemo(() => {
    return [...openings].sort((a, b) => {
      const voteA = myVotes[a.id];
      const voteB = myVotes[b.id];

      const isRatedA = !!voteA;
      const isRatedB = !!voteB;

      if (!isRatedA && isRatedB) return -1;
      if (isRatedA && !isRatedB) return 1;

      if (!isRatedA && !isRatedB) {
        return (a.orderNumber || 0) - (b.orderNumber || 0);
      }

      const isProtectedA = voteA?.isProtected || false;
      const isProtectedB = voteB?.isProtected || false;

      if (isProtectedA && !isProtectedB) return -1;
      if (!isProtectedA && isProtectedB) return 1;

      const rateA = voteA?.rate || 0;
      const rateB = voteB?.rate || 0;

      return rateB - rateA;
    });
  }, [openings, myVotes]);

  const nextOpening = useMemo(() => {
    return sortedOpenings.find((op) => !myVotes[op.id]);
  }, [sortedOpenings, myVotes]);

  return {
    sortedOpenings,
    nextOpening,
  };
};
