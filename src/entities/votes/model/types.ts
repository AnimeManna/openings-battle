import type { Database } from "@/shared/database.types";

export type VoteDTO = Database["public"]["Tables"]["votes"]["Row"];

export type Vote = {
  openingId: string;
  rate: number;
};
