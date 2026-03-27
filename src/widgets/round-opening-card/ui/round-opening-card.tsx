import { OpeningMainInfo } from "@/entities/openings/ui/main-info/opening-main-info";
import classess from "./round-opening-card.module.scss";

interface RoundOpeningCardProps {
  roundId: string;
  openingId: string;
}

export const RoundOpeningCard: React.FC<RoundOpeningCardProps> = ({
  roundId,
  openingId,
}) => {
  return (
    <div className={classess.container}>
      <OpeningMainInfo openingId={openingId} />
    </div>
  );
};
