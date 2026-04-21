import type { Round, RoundDTO } from "./types";

export const formatRound = (roundDTO: RoundDTO): Round => ({
  id: roundDTO.id,
  name: roundDTO.name,
  status: roundDTO.status,
  openingIds: (Array.isArray(roundDTO.opening_ids)
    ? roundDTO.opening_ids
    : []
  ).map((dto) => ({ openingId: dto.opening_id, isWinner: dto.is_winner })),
  startAt: roundDTO.start_at,
  maxChoices: roundDTO.max_choices,
});
