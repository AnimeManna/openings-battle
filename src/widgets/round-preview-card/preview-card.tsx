import classess from "./preview-card.module.scss";
import { getYoutubeThubnail } from "@/shared/helpers/getYoutubeThubnail";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Duration } from "dayjs/plugin/duration";
import { durationManager } from "@/managers/duration-manager/duration-manager";
import { getDurationBetweenDates } from "@/shared/helpers/getDurationBetweenDates";
import { Button } from "@/shared/ui/button/button";
import { useOpeningsStore } from "@/entities/openings/model/store";
import { useNavigate } from "react-router";
import { useRoundsStore } from "@/entities/rounds/model/store";
import clsx from "clsx";
import { MdCheck } from "react-icons/md";
import { StatusRing } from "@/shared/ui/status-ring/status-ring";
import { useRoundVoteStats } from "@/features/round-vote/hooks/useRoundVoteStats";

type RoundPreviewCardProps = {
  roundId: string;
};

const dateFormat = "D [д.] HH [ч.] mm [м.] ss [с.]";

export const RoundPreviewCard: React.FC<RoundPreviewCardProps> = ({
  roundId,
}) => {
  const { openingsMap } = useOpeningsStore();
  const round = useRoundsStore((state) => state.roundsMap.get(roundId));

  const navigate = useNavigate();
  const { currentVotesCount, roundVotes } = useRoundVoteStats(roundId);

  const navigateToRound = () => {
    navigate(`/round/${roundId}`);
  };

  const [startAtDuration, setStartAtDuration] = useState<Duration>(
    getDurationBetweenDates(dayjs().utc(), dayjs.utc(round?.startAt)),
  );

  useEffect(() => {
    if (!round) return;

    durationManager.subscribe({
      id: roundId,
      endTime: round.startAt,
      onFinish: setStartAtDuration,
      onTick: setStartAtDuration,
    });

    return () => {
      durationManager.unsubscribe(roundId);
    };
  }, [roundId, round]);

  const isRoundCompleted = useMemo(
    () => round?.status === "completed",
    [round],
  );

  const isRoundOpen = useMemo(
    () => startAtDuration.asMilliseconds() <= 0,
    [startAtDuration],
  );

  const isAllVoted = useMemo(
    () => currentVotesCount === round?.maxChoices,
    [currentVotesCount, round],
  );

  const isOpeningVoted = (openingId: string): boolean =>
    !!roundVotes?.has(openingId);

  if (!round) {
    navigate(`/`);
    return;
  }

  return (
    <div
      className={clsx(classess.container, {
        [classess.allVoted]: isAllVoted,
        [classess.isRoundOpen]: isRoundOpen,
      })}
    >
      <div className={classess.header}>
        <p className={classess.title}>{round.name}</p>
        <div className={classess.votes}>
          <p className={classess["votes__label"]}>Голоса:</p>
          <p className={classess["votes__value"]}>
            {currentVotesCount}/{round.maxChoices}
          </p>
        </div>
      </div>
      <div className={classess.wrapper}>
        <ul className={classess.list}>
          {round.openingIds.map((openingId) => {
            const opening = openingsMap.get(openingId);

            return opening ? (
              <li
                key={openingId}
                className={clsx(classess.item, {
                  [classess["item__voted"]]: isOpeningVoted(openingId),
                })}
              >
                {isOpeningVoted(openingId) && (
                  <div className={classess["item__voted__icon"]}>
                    <StatusRing variant="golden">
                      <MdCheck />
                    </StatusRing>
                  </div>
                )}
                <img
                  src={getYoutubeThubnail(opening.videoUrl)}
                  className={classess.image}
                />
              </li>
            ) : null;
          })}
        </ul>

        <div className={classess.blur}>
          {isRoundCompleted ? (
            <Button
              onClick={navigateToRound}
              className={clsx(classess["allVoted__button"])}
            >
              Посмотреть результаты
            </Button>
          ) : isAllVoted ? (
            <Button
              onClick={navigateToRound}
              className={clsx(classess["allVoted__button"])}
            >
              Переголосовать
            </Button>
          ) : isRoundOpen ? (
            <Button onClick={navigateToRound}>Голосовать</Button>
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
