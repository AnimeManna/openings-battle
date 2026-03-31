import type { Database } from "@/shared/database.types";

export type RoundStatus = Database["public"]["Enums"]["round_status"];

export type RoundDTO =
  Database["public"]["Functions"]["get_sorted_rounds"]["Returns"][number];

export type Round = {
  id: string;
  name: string;
  status: RoundStatus;
  openingIds: string[];
  startAt: string;
  maxChoices: number;
};
