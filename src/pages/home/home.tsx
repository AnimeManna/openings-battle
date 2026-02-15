import { NavTile } from "@/shared/ui/nav-tile/nav-tile";
import classess from "./home.module.scss";
import { FaVoteYea } from "react-icons/fa";
import { MdListAlt } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { HomeInfo } from "@/widgets/home/info/info";
import { useVotesStore } from "@/entities/votes/model/store";
import { useMemo } from "react";
import { useOpeningsStore } from "@/entities/openings/model/store";

export const HomeComponent: React.FC = () => {
  const openings = useOpeningsStore((state) => state.openings);
  const votes = useVotesStore((state) => state.votesMap);

  const nextOpening = useMemo(
    () => openings.find((opening) => !votes.get(opening.id)),
    [openings, votes],
  );

  return (
    <div className={classess.container}>
      <div className={classess.tile}>
        <HomeInfo />
      </div>
      {nextOpening && (
        <div className={classess.tile}>
          <NavTile
            icon={<FaVoteYea />}
            label="Продолжить голосование"
            to={`/openings/${nextOpening.id}`}
          />
        </div>
      )}
      <div className={classess.tile}>
        <NavTile icon={<MdListAlt />} label="Мой список" to="/openings" />
      </div>
      <div className={classess.tile}>
        <NavTile icon={<GiTrophyCup />} label="Статистика" to="/statistics" />
      </div>
    </div>
  );
};
