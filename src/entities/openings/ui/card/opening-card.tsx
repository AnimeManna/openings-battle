import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import type { Opening } from "../../model/types";
import classess from "./opening-card.module.scss";
import { useMemo } from "react";

type OpeningCardProps = Opening;

export const OpeningCard: React.FC<OpeningCardProps> = ({
  videoUrl,
  title,
  openingNum,
  anime,
}) => {
  const youtubeThubnail = useMemo(() => {
    return (
      "http://img.youtube.com/vi/" +
      getYoutubeId(videoUrl) +
      "/maxresdefault.jpg"
    );
  }, [videoUrl]);

  return (
    <div className={classess.container}>
      <img
        className={classess.thumbnailWrapper}
        src={youtubeThubnail}
        title="Preview"
      />
      <div className={classess.overlay}>
        <p className={classess.title}>{title}</p>
        <p className={classess.anime}>
          {anime?.title} {openingNum}op
        </p>
      </div>
    </div>
  );
};
