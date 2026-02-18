import { useOpeningsStore } from "@/entities/openings/model/store";
import { OpeningCard } from "@/entities/openings/ui/card/opening-card";
import { useDraggable } from "@dnd-kit/react";
import { useMemo } from "react";
import classess from "./card.module.scss";

interface CalibrationCardProps {
  id: string;
}

export const CalibrationCard: React.FC<CalibrationCardProps> = ({ id }) => {
  const { ref } = useDraggable({
    id,
  });

  const { openingsMap } = useOpeningsStore();

  const opening = useMemo(() => openingsMap.get(id), [openingsMap, id]);

  return (
    <div ref={ref} className={classess.container}>
      {opening && <OpeningCard {...opening} />}
    </div>
  );
};
