import { useRoundsStore } from "@/entities/rounds/model/store";
import { useStageStore } from "@/entities/stage/model/store";
import { RoundPreviewCard } from "@/features/rounds/ui/preview-card/preview-card";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import classess from "./stage-details.module.scss";
import { useRoundVotesStore } from "@/entities/round-votes/model/store";
import { useAuthStore } from "@/entities/auth/model/store";

export const StageDetails: React.FC = () => {
  const params = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const { fetchRounds, roundsMap } = useRoundsStore();
  const { stagesMap } = useStageStore();
  const { fetchAllRoundVotes } = useRoundVotesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (params.stageId && user) {
      fetchRounds(params.stageId);
      fetchAllRoundVotes(user.id);
    }
  }, [params, fetchRounds, fetchAllRoundVotes, user]);

  const stage = useMemo(
    () => (params.stageId ? stagesMap.get(params.stageId) : null),
    [params, stagesMap],
  );

  const roundsArray = useMemo(
    () => Array.from(roundsMap.values()),
    [roundsMap],
  );

  if (!stage) {
    navigate("/stages");
    return;
  }

  const navigateToRound = (id: string) => {
    navigate(`/round/${id}`);
  };

  return (
    <div className={classess.container}>
      <p className={classess.name}>{stage.name}</p>
      <ul className={classess.list}>
        {roundsArray.map((round) => (
          <li key={round.id} className={classess.item}>
            <RoundPreviewCard
              {...round}
              onClick={() => {
                navigateToRound(round.id);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
