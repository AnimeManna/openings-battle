import { useAuthStore } from "@/entities/auth/model/store";
import { useRoundVotesStore } from "@/entities/round-votes/model/store";
import { notifier } from "@/shared/lib/notifier";
import { useRoundVoteStats } from "./useRoundVoteStats";

export const useRoundVoteActions = (roundId: string) => {
  const { submitRoundVote, removeVote } = useRoundVotesStore();
  const { user } = useAuthStore();
  const { isAllowedToVote, isRoundCompleted } = useRoundVoteStats(roundId);

  const handleVote = (openingId: string) => {
    if (isRoundCompleted) {
      notifier.error("Раунд закончился.");
      return;
    }
    if (!isAllowedToVote) {
      notifier.error("Слишком много голосов.");
      return;
    }
    if (!user?.id) {
      notifier.error("Не смогли найти раунд. Перезайдите");
      return;
    }
    submitRoundVote({ roundId, openingId, userId: user.id });
  };

  const handleRemoveVote = (openingId: string) => {
    if (!user?.id) {
      notifier.error("Не смогли найти раунд. Перезайдите");
      return;
    }
    removeVote({ roundId, openingId, userId: user.id });
  };

  return {
    handleVote,
    handleRemoveVote,
  };
};
