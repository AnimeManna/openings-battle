import type { Database } from "@/shared/database.types";

export type RoundVoteDTO = Database["public"]["Tables"]["round_votes"]["Row"];

export type RoundVote = {
  userId: string;
  roundId: string;
  openingId: string;
};
