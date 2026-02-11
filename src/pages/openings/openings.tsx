import { useOpeningsStore } from "@/entities/openings/model";

import classess from "./openings.module.scss";
import { OpeningRow } from "@/features/opening/opening-row/opening-row";
import { OpeningListPreview } from "@/features/opening/opening-list-preview/opening-list-preview";
import { useVotesStore } from "@/entities/votes/model";
import { useMemo } from "react";

export const Openings: React.FC = () => {
  const openings = useOpeningsStore((state) => state.openings);
  const myVotes = useVotesStore((state) => state.myVotes);

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

  return (
    <div className={classess.container}>
      <p className={classess.title}>Ваши оценки</p>
      <ul className={classess.list}>
        {sortedOpenings.map((opening) => (
          <li key={opening.id}>
            <OpeningRow opening={opening}>
              <OpeningListPreview opening={opening} />
            </OpeningRow>
          </li>
        ))}
      </ul>
    </div>
  );
};
