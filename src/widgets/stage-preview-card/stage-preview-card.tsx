import clsx from "clsx";
import classess from "./stage-preview-card.module.scss";
import { useStageStore } from "@/entities/stage/model/store";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { durationManager } from "@/managers/duration-manager/duration-manager";
import type { Duration } from "dayjs/plugin/duration";
import dayjs from "dayjs";
import { getDurationBetweenDates } from "@/shared/helpers/getDurationBetweenDates";

type StagePreviewCardProps = {
  stageId: string;
};

const dateFormat = "D [д.] HH [ч.] mm [м.] ss [с.]";

export const StagePreviewCard: React.FC<StagePreviewCardProps> = ({
  stageId,
}) => {
  const stage = useStageStore((state) => state.stagesMap.get(stageId) ?? null);

  const [completedAtDuration, setCompletedAtDuration] = useState<Duration>(
    getDurationBetweenDates(dayjs().utc(), dayjs.utc(stage?.completedAt)),
  );

  const navigate = useNavigate();

  const navigateToStage = (id: string) => {
    navigate(`/stages/${id}`);
  };

  useEffect(() => {
    if (!stage) return;

    durationManager.subscribe({
      id: stageId,
      endTime: stage.completedAt,
      onFinish: setCompletedAtDuration,
      onTick: setCompletedAtDuration,
    });

    return () => {
      durationManager.unsubscribe(stageId);
    };
  }, [stageId, stage]);

  if (!stage) {
    navigate("/");
    return;
  }

  return (
    <div
      className={clsx(classess.item, {
        [classess.active]: stage.status === "active",
      })}
      onClick={() => {
        navigateToStage(stage.id);
      }}
    >
      <p className={classess.title}>"{stage.name}"</p>
      <div className={classess.timer}>
        {completedAtDuration.asMilliseconds() > 0 ? (
          <>
            <p className={classess["timer__label"]}>Закончиться через: </p>
            <p className={classess["timer__value"]}>
              {completedAtDuration.format(dateFormat)}
            </p>
          </>
        ) : (
          <p className={classess["timer__value"]}>Закончен</p>
        )}
      </div>
    </div>
  );
};
