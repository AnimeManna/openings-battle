import { getAccumulatedOpeningTitle } from "./helpers";
import type { Opening, OpeningDTO, SortedOpeningDTO } from "./types";

export const formatOpening = (openingDTO: OpeningDTO): Opening => ({
  id: openingDTO.id,
  title: openingDTO.title ?? "",
  videoUrl: "",
  backUpVideoUrl: "",
  openingNum: openingDTO.opening_num ?? 1,
  anime: openingDTO.anime
    ? {
        id: openingDTO.anime.id,
        englishTitle: openingDTO.anime.english_title ?? "",
        japaneseTitle: openingDTO.anime.japanese_title ?? "",
        russianTitle: openingDTO.anime.russian_title ?? "",
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
  backUpVideoUrl: sortedOpeningDTO.back_up_video_url,
  openingNum: sortedOpeningDTO.opening_num ?? 1,
  anime: sortedOpeningDTO.anime_data
    ? {
        id: sortedOpeningDTO.anime_data.id,
        englishTitle: sortedOpeningDTO.anime_data.english_title ?? "",
        japaneseTitle: sortedOpeningDTO.anime_data.japanese_title ?? "",
        russianTitle: sortedOpeningDTO.anime_data.russian_title ?? "",
      }
    : null,
  artists: sortedOpeningDTO.artists
    ? sortedOpeningDTO.artists.map((artist) => ({
        id: artist.id,
        name: artist.name ?? "",
      }))
    : [],
});
