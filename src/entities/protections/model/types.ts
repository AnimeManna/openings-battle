import type { Database } from "@/shared/database.types";

export type ProtectionDTO = Database["public"]["Tables"]["protections"]["Row"];

export type Protection = {
  openingId: string;
};
