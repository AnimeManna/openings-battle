import type { Round } from "@/entities/rounds/model/types";
import classess from "./preview-card.module.scss";
import { getYoutubeThubnail } from "@/shared/helpers/getYoutubeThubnail";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Duration } from "dayjs/plugin/duration";
import { durationManager } from "@/managers/duration-manager/duration-manager";
import { getDurationBetweenDates } from "@/shared/helpers/getDurationBetweenDates";
import { Button } from "@/shared/ui/button/button";
import { useOpeningsStore } from "@/entities/openings/model/store";

type RoundPreviewCardProps = Round & {
  onClick: () => void;
};

const dateFormat = "D [д.] HH [ч.] mm [м.] ss [с.]";

export const RoundPreviewCard: React.FC<RoundPreviewCardProps> = ({
  id,
  name,
  openingIds,
  startAt,
  onClick,
}) => {
  const { openingsMap } = useOpeningsStore();

  const [startAtDuration, setStartAtDuration] = useState<Duration>(
    getDurationBetweenDates(dayjs().utc(), dayjs(startAt)),
  );

  useEffect(() => {
    durationManager.subscribe({
      id,
      endTime: startAt,
      onFinish: setStartAtDuration,
      onTick: setStartAtDuration,
    });

    return () => {
      durationManager.unsubscribe(id);
    };
  }, [id, startAt]);

  const isRoundOpen = useMemo(
    () => startAtDuration.asMilliseconds() <= 0,
    [startAtDuration],
  );

  return (
    <div className={classess.container}>
      <p className={classess.name}>{name}</p>
      <div className={classess.wrapper}>
        <ul className={classess.list}>
          {openingIds.map((openingId) => {
            const opening = openingsMap.get(openingId);

            return opening ? (
              <li key={openingId} className={classess.item}>
                <img
                  src={getYoutubeThubnail(opening.videoUrl)}
                  className={classess.image}
                />
              </li>
            ) : null;
          })}
        </ul>

        <div className={classess.blur}>
          {isRoundOpen ? (
            <Button onClick={onClick}>Голосовать</Button>
          ) : (
            <div className={classess.start}>
              <p className={classess.startTitle}>Начнётся через</p>
              <p className={classess.startTime}>
                {startAtDuration.format(dateFormat)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
