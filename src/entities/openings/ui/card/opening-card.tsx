import type { Opening } from "../../model/types";
import classess from "./opening-card.module.scss";
import { useMemo } from "react";
import { getYoutubeThubnail } from "@/shared/helpers/getYoutubeThubnail";

type OpeningCardProps = Opening & {
  actionSlot?: React.ReactNode;
};

export const OpeningCard: React.FC<OpeningCardProps> = ({
  videoUrl,
  title,
  openingNum,
  anime,
  actionSlot,
}) => {
  const youtubeThubnail = useMemo(() => {
    return getYoutubeThubnail(videoUrl);
  }, [videoUrl]);

  return (
    <div className={classess.container}>
      <img
        className={classess.thumbnailWrapper}
        src={youtubeThubnail}
        title="Preview"
      />
      <div className={classess.overlay}>
        <div className={classess.info}>
          <p className={classess.title}>{title}</p>
          <p className={classess.anime}>
            {anime?.englishTitle} {openingNum}op
          </p>
        </div>
        {actionSlot && <div className={classess.action}>{actionSlot}</div>}
      </div>
    </div>
  );
};
