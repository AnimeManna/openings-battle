import type { SortedOpeningDTO } from "./types";

export const getAccumulatedOpeningTitle = (opening: SortedOpeningDTO): string =>
  `${opening.title} by ${opening.artists && opening.artists.length > 0 ? opening.artists.map((artist) => artist.name).join(", ") : ""}`.trim();
