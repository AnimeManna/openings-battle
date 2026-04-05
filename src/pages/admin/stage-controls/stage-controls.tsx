import { Button } from "@/shared/ui/button/button";
import classess from "./stage-controls.module.scss";
import { useStageStore } from "@/entities/stage/model/store";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Modal } from "@/shared/ui/modal/modal";
import { GenerateStageWidget } from "@/widgets/generate-stage/ui/generate-stage";

export const StageControlsPage: React.FC = () => {
  const { generateFirstStage, fetchStages, stagesMap, closeCurrentStage } =
    useStageStore();

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const generateStagesHandler = async () => {
    await generateFirstStage();
    fetchStages();
  };

  const stages = useMemo(() => Array.from(stagesMap.values()), [stagesMap]);

  const [isOpenGenerateModal, setIsOpenGenerateModal] =
    useState<boolean>(false);

  const onGenerateNextStageHandler = () => {
    setIsOpenGenerateModal(false);
    fetchStages();
  };

  return (
    <div className={classess.container}>
      <div className={classess.actions}>
        <Button onClick={generateStagesHandler}>
          Сгенерировать первый этап
        </Button>
        <Button
          onClick={() => {
            setIsOpenGenerateModal(true);
          }}
        >
          Сгенерировать следующий этап
        </Button>
        <Button onClick={closeCurrentStage} variant="danger">
          Закрыть текущий стейдж
        </Button>
      </div>
      <ul className={classess["stages-list"]}>
        {stages.length > 0
          ? stages.map((stage) => (
              <li key={stage.id} className={classess["stages-list__item"]}>
                <p className={classess["stages-list__column"]}>{stage.id}</p>
                <p className={classess["stages-list__column"]}>{stage.name}</p>
                <p className={classess["stages-list__column"]}>
                  {stage.status}
                </p>
                <p className={classess["stages-list__column"]}>
                  {dayjs.utc(stage.completedAt).format("DD.MM HH:mm")}
                </p>
              </li>
            ))
          : null}
      </ul>
      {isOpenGenerateModal ? (
        <Modal
          onClose={() => {
            setIsOpenGenerateModal(false);
          }}
        >
          <GenerateStageWidget onSubmit={onGenerateNextStageHandler} />
        </Modal>
      ) : null}
    </div>
  );
};
