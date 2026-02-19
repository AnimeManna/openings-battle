import { useOpeningsStore } from "@/entities/openings/model/store";
import { OpeningCard } from "@/entities/openings/ui/card/opening-card";
import { useDraggable } from "@dnd-kit/react";
import { useMemo } from "react";
import classess from "./card.module.scss";
import { MdDragHandle } from "react-icons/md";
import { Button } from "@/shared/ui/button/button";
interface CalibrationCardProps {
  openingId: string;
  onSelect: (id: string) => void;
}

export const CalibrationCard: React.FC<CalibrationCardProps> = ({
  openingId,
  onSelect,
}) => {
  const { ref, handleRef } = useDraggable({
    id: openingId,
  });

  const { openingsMap } = useOpeningsStore();

  const opening = useMemo(
    () => openingsMap.get(openingId),
    [openingsMap, openingId],
  );

  return (
    <div ref={ref} className={classess.container}>
      <button className={classess.dragButton} ref={handleRef}>
        <MdDragHandle />
      </button>
      {opening && (
        <OpeningCard
          {...opening}
          actionSlot={
            <Button
              onClick={() => {
                onSelect(openingId);
              }}
              size="xs"
            >
              Посмотреть
            </Button>
          }
        />
      )}
    </div>
  );
};
