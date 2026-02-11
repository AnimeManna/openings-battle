import { NavTile } from "@/shared/ui/nav-tile/nav-tile";
import classess from "./home.module.scss";
import { FaVoteYea } from "react-icons/fa";
import { MdListAlt } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { useNextOpening } from "@/shared/hooks/useNextOpening";

export const HomeComponent: React.FC = () => {
  const { nextOpening } = useNextOpening();

  return (
    <div className={classess.container}>
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
        <NavTile icon={<GiTrophyCup />} label="Тир лист" to="/openings" />
      </div>
    </div>
  );
};
