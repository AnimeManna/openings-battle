import { Navigate, useNavigate, useParams } from "react-router";
import classess from "./rate-opening.module.scss";
import { useMemo, useState } from "react";
import { APP_CONFIG } from "@/shared/config";
import { RateButton } from "@/shared/ui/rate-button/rate-button";
import { ShieldButton } from "@/features/opening/shield-button/shield-button";
import { useOpeningVote } from "@/entities/votes/hooks/useOpeningVote";
import { getYoutubeId } from "@/shared/helpers/getYoutubeId";
import { NavCorner } from "@/shared/ui/nav-corner/nav-corner";
import { useSwipeable } from "react-swipeable";
import { getVideoEmbedUrl } from "@/shared/helpers/getVideoUrl";
import { motion, AnimatePresence } from "framer-motion";
import type { Opening } from "@/entities/openings/model/types";
import { useSnackbarStore } from "@/shared/model/snackbar/store";
import { useOpeningsStore } from "@/entities/openings/model/store";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const RateOpening: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { openings } = useOpeningsStore();

  const { rate, onRate, isProtected, onProtect } = useOpeningVote(
    params.id ?? "",
  );

  const show = useSnackbarStore((state) => state.show);

  const navigation: {
    prevId: string | null;
    nextId: string | null;
    opening: Opening | null;
    currentIndex: number | null;
  } = useMemo(() => {
    if (!params.id || openings.length === 0) {
      return { prevId: null, nextId: null, opening: null, currentIndex: null };
    }

    const currentIndex = openings.findIndex((op) => op.id === params.id);

    if (currentIndex === -1)
      return { prevId: null, nextId: null, opening: null, currentIndex };

    return {
      prevId: currentIndex > 0 ? openings[currentIndex - 1].id : null,
      nextId:
        currentIndex < openings.length - 1
          ? openings[currentIndex + 1].id
          : null,
      opening: openings[currentIndex],
      currentIndex,
    };
  }, [openings, params.id]);

  const { opening, prevId, nextId } = navigation;

  // const DEFAULT_TRESHHOLD = 5;

  // useEffect(() => {
  //   if (
  //     currentIndex &&
  //     openings.length - currentIndex <= DEFAULT_TRESHHOLD &&
  //     !isLoading
  //   ) {
  //     fetchSortedOpenings(page + 1);
  //   }
  // }, [currentIndex, isLoading, page, fetchSortedOpenings, openings]);

  const [direction, setDirection] = useState(0);

  const navigateToNext = () => {
    if (nextId) {
      navigate(`/openings/${nextId}`);
      setDirection(1);
    }
  };

  const navigateToPrevious = () => {
    if (prevId) {
      navigate(`/openings/${prevId}`);
      setDirection(-1);
    }
  };

  const slideToPrevious = () => {
    if (prevId) {
      navigate(`/openings/${prevId}`);
      setDirection(1);
    }
  };

  const slideToNext = () => {
    if (nextId) {
      navigate(`/openings/${nextId}`);
      setDirection(-1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: slideToPrevious,
    onSwipedRight: slideToNext,
  });

  if (!opening) {
    return <Navigate to="/" />;
  }

  const rateOpening = (value: string | number) => {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    onRate(numValue);
    show("Ваш голос успешно засчитан", "success", 1000);
  };

  const youtubeId = getYoutubeId(opening.videoUrl);

  const scoreArray = Array.from({ length: APP_CONFIG.MAX_SCORE }).map(
    (_, index) => index + 1,
  );

  return (
    <div className={classess.container} {...swipeHandlers}>
      <div className={classess.left}>
        {prevId && <NavCorner direction="left" onClick={navigateToPrevious} />}
      </div>
      <div className={classess.center}>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={params.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className={classess.wrapper}
          >
            <p className={classess.title}>{opening.title}</p>
            {youtubeId && (
              <iframe
                className={classess.thumbnailWrapper}
                src={getVideoEmbedUrl(youtubeId)}
                title="Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            <div className={classess.infoGrid}>
              <div className={classess.label}>Аниме</div>
              <div className={classess.value}>{opening.anime?.title}</div>

              <div className={classess.label}>Номер Опенинга</div>
              <div className={classess.value}>{opening.openingNum}</div>
            </div>

            <div className={classess.rating}>
              <ul className={classess.list}>
                {scoreArray.map((rating) => (
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={classess.right}>
        {nextId && <NavCorner direction="right" onClick={navigateToNext} />}
      </div>
    </div>
  );
};
