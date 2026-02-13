import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import type { Opening } from "../../../entities/openings/types";
import classess from "./opening-list-preview.module.scss";
import { APP_CONFIG } from "@/shared/config";
import { RateButton } from "@/shared/ui/rate-button/rate-button";
import { useOpeningVote } from "@/entities/votes/useOpeningVote";
import { ShieldButton } from "../shield-button/shield-button";
import { NavCorner } from "@/shared/ui/nav-corner/nav-corner";
import { useSnackbarStore } from "@/shared/model/snackbar/store";

interface OpeningInfoProps {
  opening: Opening;
}

export const OpeningListPreview: React.FC<OpeningInfoProps> = ({ opening }) => {
  const { rate, onRate, isProtected, onProtect } = useOpeningVote(opening.id);
  const show = useSnackbarStore((state) => state.show);

  const rateOpening = (value: string | number) => {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    onRate(numValue);
    show("Ваш голос успешно засчитан", "success", 1000);
  };

  const getYoutubuThumbNail = (youtubeUrl: string) => {
    return (
      "http://img.youtube.com/vi/" +
      getYoutubeId(youtubeUrl) +
      "/maxresdefault.jpg"
    );
  };

  return (
    <div className={classess.container}>
      <div className={classess.wrapper}>
        <img
          className={classess.thumbnailWrapper}
          src={getYoutubuThumbNail(opening.youtubeUrl)}
          title="Preview"
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
        <div className={classess.link}>
          <NavCorner link={opening.id} />
        </div>
      </div>
    </div>
  );
};
