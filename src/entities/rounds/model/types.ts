import type { Database } from "@/shared/database.types";

export type RoundStatus = Database["public"]["Enums"]["round_status"];

export type RoundDTO = Database["public"]["Tables"]["rounds"]["Row"] & {
  opening_ids: {
    opening_id: Database["public"]["Tables"]["round_participants"]["Row"]["opening_id"];
  }[];
};

export type Round = {
  id: string;
  name: string;
  status: RoundStatus;
  openingIds: string[];
  startAt: string;
};
