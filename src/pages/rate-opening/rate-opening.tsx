import { Navigate, useNavigate, useParams } from "react-router";
import classess from "./rate-opening.module.scss";
import { useMemo } from "react";
import { APP_CONFIG } from "@/shared/config";
import { RateButton } from "@/shared/ui/rate-button/rate-button";
import { ShieldButton } from "@/features/opening/shield-button/shield-button";
import { useOpeningVote } from "@/entities/votes/useOpeningVote";
import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import { NavCorner } from "@/shared/ui/nav-corner/nav-corner";
import { useSwipeable } from "react-swipeable";
import { useSortedOpenings } from "@/features/opening/hooks/useSortedOpenings";

export const RateOpening: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { sortedOpenings: openings } = useSortedOpenings();

  const { rate, onRate, isProtected, onProtect } = useOpeningVote(
    params.id ?? "",
  );

  const navigation = useMemo(() => {
    if (!params.id || openings.length === 0) {
      return { prevId: null, nextId: null, current: null };
    }

    const currentIndex = openings.findIndex((op) => op.id === params.id);

    if (currentIndex === -1)
      return { prevId: null, nextId: null, current: null };

    console.log(currentIndex, openings.length);
    return {
      prevId: currentIndex > 0 ? openings[currentIndex - 1].id : null,
      nextId:
        currentIndex < openings.length - 1
          ? openings[currentIndex + 1].id
          : null,
      opening: openings[currentIndex],
    };
  }, [openings, params.id]);

  const { opening, prevId, nextId } = navigation;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextId) navigate(`/openings/${nextId}`);
    },
    onSwipedRight: () => {
      if (prevId) navigate(`/openings/${prevId}`);
    },
  });

  if (!opening) {
    return <Navigate to="/" />;
  }

  const rateOpening = (value: string | number) => {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    onRate(numValue);
  };

  return (
    <div className={classess.container} {...swipeHandlers}>
      <div className={classess.left}>
        {prevId && <NavCorner direction="left" link={`/openings/${prevId}`} />}
      </div>
      <div className={classess.center}>
        <div className={classess.wrapper}>
          <p className={classess.title}>{opening.title}</p>
          <iframe
            className={classess.thumbnailWrapper}
            src={`https://www.youtube.com/embed/${getYoutubeId(opening.youtubeUrl)}`}
            title="Preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className={classess.infoGrid}>
            <div className={classess.label}>Аниме</div>
            <div className={classess.value}>{opening.anime}</div>

            <div className={classess.label}>Номер Опенинга</div>
            <div className={classess.value}>{opening.orderNumber}</div>
          </div>

          <div className={classess.rating}>
            <ul className={classess.list}>
              {Array.from({ length: APP_CONFIG.MAX_SCORE })
                .map((_, index) => index + 1)
                .map((rating) => (
                  <li key={rating}>
                    <RateButton
                      value={rating}
                      onClick={rateOpening}
                      isActive={rate === rating}
                      size="xl"
                    />
                  </li>
                ))}
            </ul>
          </div>
          <ShieldButton isActive={isProtected} onClick={onProtect} />
        </div>
      </div>

      <div className={classess.right}>
        {nextId && <NavCorner direction="right" link={`/openings/${nextId}`} />}
      </div>
    </div>
  );
};
