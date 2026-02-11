import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import type { Opening } from "../../../entities/openings/types";
import classess from "./opening-list-preview.module.scss";
import { APP_CONFIG } from "@/shared/config";
import { RateButton } from "@/shared/ui/rate-button/rate-button";
import { useOpeningVote } from "@/entities/votes/useOpeningVote";
import { ShieldButton } from "../shield-button/shield-button";
import { NavCorner } from "@/shared/ui/nav-corner/nav-corner";

interface OpeningInfoProps {
  opening: Opening;
}

export const OpeningListPreview: React.FC<OpeningInfoProps> = ({ opening }) => {
  const { rate, onRate, isProtected, onProtect } = useOpeningVote(opening.id);

  const rateOpening = (value: string | number) => {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    onRate(numValue);
  };

  return (
    <div className={classess.container}>
      <div className={classess.wrapper}>
        <iframe
          className={classess.thumbnailWrapper}
          src={`https://www.youtube.com/embed/${getYoutubeId(opening.youtubeUrl)}`}
          title="Preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        <div className={classess.infoGrid}>
          <div className={classess.label}>Трек</div>
          <div className={classess.value}>{opening.title}</div>

          <div className={classess.label}>Аниме</div>
          <div className={classess.value}>{opening.anime}</div>

          <div className={classess.label}>Номер Опенинга</div>
          <div className={classess.value}>{opening.orderNumber}</div>
        </div>

        <div className={classess.raiting}>
          <p className={classess["raiting__title"]}>Поставить быструю оценку</p>
          <ul className={classess["raiting__list"]}>
            {Array.from({ length: APP_CONFIG.MAX_SCORE })
              .map((_, index) => index + 1)
              .map((rating) => (
                <li key={rating}>
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
      </div>
      <div>
        <NavCorner link={opening.id} />
      </div>
    </div>
  );
};
