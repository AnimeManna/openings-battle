import type { Vote, VoteDTO } from "./types";

export const formatVote = (voteDTO: VoteDTO): Vote => ({
  openingId: voteDTO.opening_id,
  rate: voteDTO.rate ?? 0,
});
