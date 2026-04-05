import { NavTile } from "@/shared/ui/nav-tile/nav-tile";
import classess from "./home.module.scss";
import { FaVoteYea } from "react-icons/fa";
import { MdListAlt } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { HomeInfo } from "@/widgets/home/info/info";
import { useVotesStore } from "@/entities/votes/model/store";
import { useMemo } from "react";
import { useOpeningsStore } from "@/entities/openings/model/store";
import { MdFormatListBulleted } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import { TbTournament } from "react-icons/tb";
import { TbCards } from "react-icons/tb";
import { useRoundsStore } from "@/entities/rounds/model/store";
import { useRoundVotesStore } from "@/entities/round-votes/model/store";
import { useStageStore } from "@/entities/stage/model/store";
import { isRoundAvalaibleByTime } from "@/entities/rounds/helpers/isRoundAvalaibleByTime";
import { useShallow } from "zustand/react/shallow";

export const HomeComponent: React.FC = () => {
  const openings = useOpeningsStore((state) => state.openings);
  const votes = useVotesStore((state) => state.votesMap);

  const rounds = useRoundsStore(useShallow((state) => state.roundsMap));
  const roundVotes = useRoundVotesStore((state) => state.roundVotesMap);

  const { stagesMap } = useStageStore();

  const nextOpening = useMemo(
    () => openings.find((opening) => !votes.get(opening.id)),
    [openings, votes],
  );

  const nextRound = useMemo(
    () =>
      Array.from(rounds.values()).find((round) => {
        if (round.status === "completed") return null;
        if (!isRoundAvalaibleByTime(round.startAt)) return null;
        const rv = roundVotes.get(round.id);
        const currentStage = Array.from(stagesMap.values()).find(
          (stage) => stage.status === "active",
        );
        if (!currentStage) return null;
        if (!rv) return round;
        if (rv.size < currentStage.maxChoicesPerRound) return round;
        return null;
      }),
    [roundVotes, rounds, stagesMap],
  );

  return (
    <div className={classess.container}>
      <div className={classess.tile}>
        <HomeInfo />
      </div>
      {nextRound && (
        <div className={classess.tile}>
          <NavTile
            variant="glass"
            icon={<TbCards />}
            label="Продолжить второй этап"
            to={`/round/${nextRound.id}`}
          />
        </div>
      )}
      <div className={classess.tile}>
        <NavTile
          variant="glass"
          icon={<TbTournament />}
          label="Стейджи"
          to="/stages"
        />
      </div>
      <div className={classess.tile}>
        <NavTile
          variant="glass"
          icon={<GiTrophyCup />}
          label="Общий тир лист"
          to="/tier-list"
        />
      </div>
      {nextOpening && (
        <div className={classess.tile}>
          <NavTile
            variant="glass"
            icon={<FaVoteYea />}
            label="Продолжить голосование"
            to={`/openings/${nextOpening.id}`}
          />
        </div>
      )}
      <div className={classess.tile}>
        <NavTile
          variant="glass"
          icon={<MdListAlt />}
          label="Мой список"
          to="/openings"
        />
      </div>
      <div className={classess.tile}>
        <NavTile
          variant="glass"
          icon={<MdQueryStats />}
          label="Моя статистика"
          to="/statistics"
        />
      </div>
      <div className={classess.tile}>
        <NavTile
          variant="glass"
          icon={<MdFormatListBulleted />}
          label="Калибровка"
          to="/calibration"
        />
      </div>
    </div>
  );
};
