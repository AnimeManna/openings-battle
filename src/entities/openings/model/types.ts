import type { AnimeRow } from "@/entities/anime/model/types";
import type { Database } from "@/shared/database.types";

type OpeningRow = Database["public"]["Tables"]["openings"]["Row"];
type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];

export type OpeningDTO = OpeningRow & {
  anime: AnimeRow | null;
};

export interface Opening {
  id: string;
  title: string;
  videoUrl: string;
  backUpVideoUrl: string;
  openingNum: number;
  anime: {
    id: string;
    englishTitle: string;
    japaneseTitle: string;
    russianTitle: string;
  } | null;
  artists:
    | {
        id: string;
        name: string;
      }[]
    | null;
}

type SortedOpeningRow =
  Database["public"]["Functions"]["get_sorted_openings"]["Returns"][number];

export type SortedOpeningDTO = Omit<
  SortedOpeningRow,
  "anime_data" | "artists"
> & {
  anime_data: AnimeRow;
  artists: ArtistRow[];
};
