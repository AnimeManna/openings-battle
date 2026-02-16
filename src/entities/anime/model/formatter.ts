import type { Anime, AnimeRow } from "./types";

export const formatAnime = (animeDTO: AnimeRow): Anime => ({
  id: animeDTO.id,
  english_title: animeDTO.english_title ?? "",
  japanese_title: animeDTO.japanese_title ?? "",
  russian_title: animeDTO.russian_title ?? "",
});
