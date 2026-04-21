import { useRoundsStore } from "@/entities/rounds/model/store";
import { useStageStore } from "@/entities/stage/model/store";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import classess from "./stage-details.module.scss";
import { useRoundVotesStore } from "@/entities/round-votes/model/store";
import { useAuthStore } from "@/entities/auth/model/store";
import { RoundPreviewCard } from "@/widgets/round-preview-card/preview-card";

export const StageDetails: React.FC = () => {
  const params = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const { fetchRounds, roundsMap } = useRoundsStore();
  const stage = useStageStore((state) =>
    params.stageId ? state.stagesMap.get(params.stageId) : null,
  );
  const { fetchAllRoundVotes } = useRoundVotesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (params.stageId && user) {
      fetchRounds(user.id, params.stageId);
      fetchAllRoundVotes(user.id);
    }
  }, [params, fetchRounds, fetchAllRoundVotes, user]);

  const roundsArray = useMemo(
    () => Array.from(roundsMap.values()),
    [roundsMap],
  );

  if (!stage) {
    navigate("/stages");
    return;
  }

  return (
    <div className={classess.container}>
      <p className={classess.name}>{stage.name}</p>
      <ul className={classess.list}>
        {roundsArray.map((round) => (
          <li key={round.id} className={classess.item}>
            <RoundPreviewCard roundId={round.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};
