import type { Round, RoundDTO } from "./types";

export const formatRound = (roundDTO: RoundDTO): Round => ({
  id: roundDTO.id,
  name: roundDTO.name,
  status: roundDTO.status,
  openingIds: roundDTO.opning_ids,
  startAt: roundDTO.start_at,
  maxChoices: roundDTO.max_choices,
});
