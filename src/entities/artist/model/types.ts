import type { Database } from "@/shared/database.types";

export type Artistrow = Database["public"]["Tables"]["artists"]["Row"];

export interface Artist {
  id: string;
  name: string;
}
