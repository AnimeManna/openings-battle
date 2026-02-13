import { useAuthStore } from "@/entities/auth/model";
import { useVotesStore } from "./model";
import { useSnackbarStore } from "@/shared/model/snackbar/store";

export const useOpeningVote = (openingId: string) => {
  const { user } = useAuthStore();
  const myVotes = useVotesStore((s) => s.myVotes);
  const submitVote = useVotesStore((s) => s.submitVote);
  const toggleProtect = useVotesStore((s) => s.toggleProtect);
  const show = useSnackbarStore((state) => state.show);

  const vote = myVotes[openingId];

  const handleRate = (rate: number) => {
    if (!user) return;
    submitVote(user.id, openingId, rate);
  };

  const handleProtect = async () => {
    if (!user) return;
    const response = await toggleProtect(user.id, openingId);
    show(response.message, response.status ? "success" : "error");
  };

  return {
    rate: vote?.rate,
    isProtected: vote?.isProtected || false,
    onRate: handleRate,
    onProtect: handleProtect,
  };
};
