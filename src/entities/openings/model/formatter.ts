import { getAccumulatedOpeningTitle } from "./helpers";
import type { Opening, OpeningDTO, SortedOpeningDTO } from "./types";

export const formatOpening = (openingDTO: OpeningDTO): Opening => ({
  id: openingDTO.id,
  title: openingDTO.title ?? "",
  videoUrl: "",
  openingNum: openingDTO.opening_num ?? 1,
  anime: openingDTO.anime
    ? {
        id: openingDTO.anime.id,
        title: openingDTO.anime.english_title ?? "",
      }
    : null,
  artists: [],
});

export const formatSortedOpening = (
  sortedOpeningDTO: SortedOpeningDTO,
): Opening => ({
  id: sortedOpeningDTO.id,
  title: getAccumulatedOpeningTitle(sortedOpeningDTO),
  videoUrl: sortedOpeningDTO.video_url,
  openingNum: sortedOpeningDTO.opening_num ?? 1,
  anime: sortedOpeningDTO.anime_data
    ? {
        id: sortedOpeningDTO.anime_data.id,
        title: sortedOpeningDTO.anime_data.english_title ?? "",
      }
    : null,
  artists: sortedOpeningDTO.artists
    ? sortedOpeningDTO.artists.map((artist) => ({
        id: artist.id,
        name: artist.name ?? "",
      }))
    : [],
});
