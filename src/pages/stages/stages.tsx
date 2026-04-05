import { useStageStore } from "@/entities/stage/model/store";
import { useMemo } from "react";
import classess from "./stages.module.scss";
import { StagePreviewCard } from "@/widgets/stage-preview-card/stage-preview-card";

export const StagesPage: React.FC = () => {
  const { stagesMap } = useStageStore();

  const stagesArray = useMemo(
    () => Array.from(stagesMap.values()),
    [stagesMap],
  );

  return (
    <div className={classess.container}>
      <ul className={classess.list}>
        {stagesArray.length > 0 &&
          stagesArray.map((stage) => (
            <StagePreviewCard key={stage.id} stageId={stage.id} />
          ))}
      </ul>
    </div>
  );
};
