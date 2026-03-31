import type { Database } from "@/shared/database.types";

export type StageDTO = Database["public"]["Tables"]["stages"]["Row"];

export type StageStatus = Database["public"]["Enums"]["stage_status"];

export type StageFormat = Database["public"]["Enums"]["round_format"];

export interface Stage {
  id: string;
  name: string;
  maxChoicesPerRound: number;
  status: StageStatus;
  format: StageFormat;
  completedAt: string;
}
