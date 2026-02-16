import type { Artist, ArtistRow } from "./types";

export const formatArtist = (artistDTO: ArtistRow): Artist => ({
  id: artistDTO.id,
  name: artistDTO.name ?? "",
});
