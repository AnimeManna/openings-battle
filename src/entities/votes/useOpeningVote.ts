import { useAuthStore } from "@/entities/auth/model";
import { useVotesStore } from "./model";

export const useOpeningVote = (openingId: string) => {
  const { user } = useAuthStore();
  const myVotes = useVotesStore((s) => s.myVotes);
  const submitVote = useVotesStore((s) => s.submitVote);
  const toggleProtect = useVotesStore((s) => s.toggleProtect);

  const vote = myVotes[openingId];

  const handleRate = (rate: number) => {
    if (!user) return;
    submitVote(user.id, openingId, rate);
  };

  const handleProtect = () => {
    if (!user) return;
    toggleProtect(user.id, openingId);
  };

  return {
    rate: vote?.rate,
    isProtected: vote?.isProtected || false,
    onRate: handleRate,
    onProtect: handleProtect,
  };
};
