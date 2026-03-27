import type { RoundVote, RoundVoteDTO } from "./types";

export const formatRoundVote = (roundVoteDTO: RoundVoteDTO): RoundVote => ({
  userId: roundVoteDTO.user_id,
  openingId: roundVoteDTO.opening_id,
  roundId: roundVoteDTO.round_id,
});
