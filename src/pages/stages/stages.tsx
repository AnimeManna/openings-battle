import { useStageStore } from "@/entities/stage/model/store";
import { useMemo } from "react";
import classess from "./stages.module.scss";
import clsx from "clsx";
import { useNavigate } from "react-router";

export const StagesPage: React.FC = () => {
  const { stagesMap } = useStageStore();

  const stagesArray = useMemo(
    () => Array.from(stagesMap.values()),
    [stagesMap],
  );

  const navigate = useNavigate();

  const navigateToStage = (id: string) => {
    navigate(`/stages/${id}`);
  };

  return (
    <div className={classess.container}>
      <ul className={classess.list}>
        {stagesArray.length > 0 &&
          stagesArray.map((stage) => (
            <li
              className={clsx(classess.item, {
                [classess.active]: stage.status === "pending",
              })}
              onClick={() => {
                navigateToStage(stage.id);
              }}
              key={stage.id}
            >
              <p className={classess.title}>{stage.name}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};
