import type { Database } from "@/shared/database.types";

export type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];

export interface Artist {
  id: string;
  name: string;
}
