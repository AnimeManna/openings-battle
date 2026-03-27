import type { Round, RoundDTO } from "./types";

export const formatRound = (roundDTO: RoundDTO): Round => ({
  id: roundDTO.id,
  name: roundDTO.name,
  status: roundDTO.status,
  openingIds: roundDTO.opening_ids.map(({ opening_id }) => opening_id),
  startAt: roundDTO.start_at,
});
