import { useRoundsStore } from "@/entities/rounds/model/store";
import { useMemo, type ReactNode } from "react";
import classess from "./round-robin-grid.module.scss";
interface RoundRobinGridProps {
  roundId: string;
  renderOpeningCard: (openingId: string) => ReactNode;
}

export const RoundRobinGrid: React.FC<RoundRobinGridProps> = ({
  roundId,
  renderOpeningCard,
}) => {
  const { roundsMap } = useRoundsStore();

  const round = useMemo(() => roundsMap.get(roundId), [roundsMap, roundId]);

  return round ? (
    <ul className={classess.grid}>
      {round.openingIds.map(({ openingId, isWinner }) => (
        <li key={openingId} className={classess.cell}>
          {renderOpeningCard(openingId)}
        </li>
      ))}
    </ul>
  ) : null;
};
