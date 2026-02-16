import type { Database } from "@/shared/database.types";

export type AnimeRow = Database["public"]["Tables"]["anime"]["Row"];

export interface Anime {
  id: string;
  english_title: string;
  japanese_title: string;
  russian_title: string;
}
