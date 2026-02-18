import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import type { Opening } from "../../../entities/openings/model/types";
import classess from "./opening-list-preview.module.scss";
import { APP_CONFIG } from "@/shared/config";
import { RateButton } from "@/shared/ui/rate-button/rate-button";
import { useOpeningVote } from "@/entities/votes/hooks/useOpeningVote";
import { ShieldButton } from "../shield-button/shield-button";
import { NavCorner } from "@/shared/ui/nav-corner/nav-corner";
import { useMemo } from "react";

interface OpeningInfoProps {
  opening: Opening;
}

const scoreArray = Array.from({ length: APP_CONFIG.MAX_SCORE }).map(
  (_, index) => index + 1,
);

export const OpeningListPreview: React.FC<OpeningInfoProps> = ({ opening }) => {
  const { rate, onRate, isProtected, onProtect } = useOpeningVote(opening.id);

  const rateOpening = (value: string | number) => {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    onRate(numValue);
  };

  const youtubeThubnail = useMemo(() => {
    return (
      "http://img.youtube.com/vi/" +
      getYoutubeId(opening.videoUrl) +
      "/maxresdefault.jpg"
    );
  }, [opening.videoUrl]);

  return (
    <div className={classess.container}>
      <div className={classess.wrapper}>
        <img
          className={classess.thumbnailWrapper}
          src={youtubeThubnail}
          title="Preview"
        />

        <div className={classess.infoGrid}>
          <div className={classess.label}>Трек</div>
          <div className={classess.value}>{opening.title}</div>

          <div className={classess.label}>Аниме</div>
          <div className={classess.value}>
            {opening.anime?.englishTitle} -- {opening.anime?.japaneseTitle}
          </div>

          <div className={classess.label}>Номер Опенинга</div>
          <div className={classess.value}>{opening.openingNum}</div>
        </div>

        <div className={classess.raiting}>
          <p className={classess["raiting__title"]}>Поставить быструю оценку</p>
          <ul className={classess["raiting__list"]}>
            {scoreArray.map((rating) => (
              <li key={opening.id + rating}>
                <RateButton
                  value={rating}
                  onClick={rateOpening}
                  isActive={rate === rating}
                />
              </li>
            ))}
          </ul>
        </div>
        <ShieldButton isActive={isProtected} onClick={onProtect} />
        <div className={classess.link}>
          <NavCorner link={opening.id} />
        </div>
      </div>
    </div>
  );
};
