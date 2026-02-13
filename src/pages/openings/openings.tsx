import classess from "./openings.module.scss";
import { OpeningRow } from "@/features/opening/opening-row/opening-row";
import { OpeningListPreview } from "@/features/opening/opening-list-preview/opening-list-preview";
import { usePlaylistStore } from "@/features/playlist/model/store";

export const Openings: React.FC = () => {
  const openings = usePlaylistStore((state) => state.playlist);

  return (
    <div className={classess.container}>
      <p className={classess.title}>Ваши оценки</p>
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
