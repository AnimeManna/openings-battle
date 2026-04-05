import { useRoundsStore } from "@/entities/rounds/model/store";
import { RoundOpeningCard } from "@/widgets/round-opening-card/ui/round-opening-card";
import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import classess from "./round.module.scss";
import { useSwipeable } from "react-swipeable";
import { NavCorner } from "@/shared/ui/nav-corner/nav-corner";
import type { Round } from "@/entities/rounds/model/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRoundVoteStats } from "@/features/round-vote/hooks/useRoundVoteStats";
import { isRoundAvlaible } from "@/entities/rounds/helpers/isRoundAvalaible";

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

export const RoundPage: React.FC = () => {
  const params = useParams<{ roundId: string }>();
  const navigate = useNavigate();

  const { roundsMap } = useRoundsStore();

  const navigation: {
    prevId: string | null;
    nextId: string | null;
    round: Round | null;
    currentIndex: number | null;
  } = useMemo(() => {
    if (!params.roundId || roundsMap.size === 0) {
      return { prevId: null, nextId: null, round: null, currentIndex: null };
    }

    const rounds = Array.from(roundsMap.values());

    const currentIndex = rounds.findIndex(
      (round) => round.id === params.roundId,
    );

    if (currentIndex === -1)
      return { prevId: null, nextId: null, round: null, currentIndex };

    const getNextRoundId = (): string | null => {
      const nextRound =
        currentIndex < rounds.length - 1 ? rounds[currentIndex + 1] : null;
      if (!nextRound) return null;
      if (isRoundAvlaible(nextRound)) return nextRound.id;
      return null;
    };

    return {
      prevId: currentIndex > 0 ? rounds[currentIndex - 1].id : null,
      nextId: getNextRoundId(),
      round: rounds[currentIndex],
      currentIndex,
    };
  }, [roundsMap, params.roundId]);

  const { round, prevId, nextId } = navigation;

  const { currentVotesCount } = useRoundVoteStats(params.roundId ?? "");

  const [direction, setDirection] = useState(0);

  const navigateToNext = () => {
    if (nextId) {
      navigate(`/round/${nextId}`);
      setDirection(1);
    }
  };

  const navigateToPrevious = () => {
    if (prevId) {
      navigate(`/round/${prevId}`);
      setDirection(-1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: navigateToNext,
    onSwipedRight: navigateToPrevious,
  });

  if (!round) {
    return <Navigate to="/" />;
  }

  if (!isRoundAvlaible(round)) {
    return <Navigate to="/" />;
  }

  return (
    <section className={classess.container} {...swipeHandlers}>
      <div className={classess.left}>
        {prevId && <NavCorner direction="left" onClick={navigateToPrevious} />}
      </div>

      <div className={classess.center}>
        <div className={classess.header}>
          <p className={classess.title}>{round.name}</p>
          <div className={classess.votes}>
            <p className={classess["votes__label"]}>Голоса:</p>
            <p className={classess["votes__value"]}>
              {currentVotesCount}/{round.maxChoices}
            </p>
          </div>
        </div>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={params.roundId}
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
            {round && (
              <ul className={classess.grid}>
                {round.openingIds.map((openingId) => (
                  <li key={openingId} className={classess.item}>
                    <RoundOpeningCard
                      roundId={round.id}
                      openingId={openingId}
                    />
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={classess.right}>
        {nextId && <NavCorner direction="right" onClick={navigateToNext} />}
      </div>
    </section>
  );
};
