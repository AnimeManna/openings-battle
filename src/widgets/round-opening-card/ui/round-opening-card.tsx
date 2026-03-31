import { OpeningMainInfo } from "@/entities/openings/ui/main-info/opening-main-info";
import classess from "./round-opening-card.module.scss";
import { Button } from "@/shared/ui/button/button";
import clsx from "clsx";
import { useRoundVoteActions } from "@/features/round-vote/hooks/useRoundVoteActions";
import { useMemo } from "react";
import { MdCheck } from "react-icons/md";
import { StatusRing } from "@/shared/ui/status-ring/status-ring";
import { useVotesStore } from "@/entities/votes/model/store";
import { Tooltip } from "@/shared/ui/tooltip/tooltip";
import { useRoundVoteStats } from "@/features/round-vote/hooks/useRoundVoteStats";

interface RoundOpeningCardProps {
  roundId: string;
  openingId: string;
}

export const RoundOpeningCard: React.FC<RoundOpeningCardProps> = ({
  roundId,
  openingId,
}) => {
  const { handleVote, handleRemoveVote } = useRoundVoteActions(roundId);
  const { roundVotes, isAllowedToVote } = useRoundVoteStats(roundId);
  const { votesMap } = useVotesStore();

  const isVotedOpening = useMemo(
    () => !!roundVotes?.has(openingId),
    [roundVotes, openingId],
  );

  const onClickHandler = () => {
    if (isVotedOpening) {
      handleRemoveVote(openingId);
    } else {
      handleVote(openingId);
    }
  };

  const openingVote = useMemo(
    () => votesMap.get(openingId),
    [votesMap, openingId],
  );

  return (
    <div
      className={clsx(classess.container, {
        [classess.isVoted]: isVotedOpening,
      })}
    >
      <div className={classess.header}>
        <div className={classess.rate}>
          <Tooltip label="Ваша оценка при голосовании" position="right">
            <StatusRing variant={openingVote ? "surface" : "default"}>
              {openingVote?.rate}
            </StatusRing>
          </Tooltip>
        </div>
        {isVotedOpening && (
          <div>
            <StatusRing variant="golden">
              <MdCheck />
            </StatusRing>
          </div>
        )}
      </div>
      <OpeningMainInfo openingId={openingId} />
      <Button
        onClick={onClickHandler}
        variant={isVotedOpening ? "secondary" : "primary"}
        disabled={!isAllowedToVote && !isVotedOpening}
      >
        {isVotedOpening ? "Убрать голос" : "Проголосовать"}
      </Button>
    </div>
  );
};
