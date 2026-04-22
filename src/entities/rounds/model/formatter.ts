import type { Round, RoundDTO } from "./types";

export const formatRound = (roundDTO: RoundDTO): Round => {
  const parsedJson = Array.isArray(roundDTO.opening_ids)
    ? (roundDTO.opening_ids as { opening_id: string; is_winner: boolean }[])
    : [];
  return {
    id: roundDTO.id,
    name: roundDTO.name,
    status: roundDTO.status,
    openingIds: parsedJson.map((dto) => ({
      openingId: dto?.opening_id ?? "",
      isWinner: dto?.is_winner ?? false,
    })),
    startAt: roundDTO.start_at,
    maxChoices: roundDTO.max_choices,
  };
};
