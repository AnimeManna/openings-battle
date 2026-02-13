import classess from "./openings.module.scss";
import { OpeningRow } from "@/features/opening/opening-row/opening-row";
import { OpeningListPreview } from "@/features/opening/opening-list-preview/opening-list-preview";
import { usePlaylistStore } from "@/features/playlist/model/store";
import { useAuthStore } from "@/entities/auth/model";

import { RiShieldStarFill } from "react-icons/ri";
import { Tooltip } from "@/shared/ui/tooltip/tooltip";

export const Openings: React.FC = () => {
  const openings = usePlaylistStore((state) => state.playlist);

  const user = useAuthStore((state) => state.user);

  return (
    <div className={classess.container}>
      <div className={classess.header}>
        <p className={classess.title}>Ваши оценки</p>
        <div className={classess.column}>
          {user && (
            <Tooltip
              position="left"
              label="Щиты позволяют перенести опенинг сразу в турнирую таблицу"
            >
              <div className={classess.shields}>
                <RiShieldStarFill className={classess.icon} />
                <div className={classess.article}>
                  <p>{user.protectionUsed}</p>
                  <p>/</p>
                  <p>{user.protectionBudget}</p>
                </div>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <ul className={classess.list}>
        {openings.map((opening) => (
          <li key={opening.id}>
            <OpeningRow opening={opening}>
              <OpeningListPreview opening={opening} />
            </OpeningRow>
          </li>
        ))}
      </ul>
    </div>
  );
};
