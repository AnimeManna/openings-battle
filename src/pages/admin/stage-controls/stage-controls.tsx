import { Button } from "@/shared/ui/button/button";
import classess from "./stage-controls.module.scss";
import { useStageStore } from "@/entities/stage/model/store";
import { useEffect } from "react";

export const StageControlsPage: React.FC = () => {
  const { generateStages, fetchStages } = useStageStore();

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const generateStagesHandler = async () => {
    await generateStages();
    fetchStages();
  };

  return (
    <div>
      <Button onClick={generateStagesHandler}>Сгенерировать сетку</Button>
    </div>
  );
};
