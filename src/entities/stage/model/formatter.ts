import type { Stage, StageDTO } from "./types";

export const formatStage = (stageDTO: StageDTO): Stage => ({
  id: stageDTO.id,
  name: stageDTO.name,
  maxChoicesPerRound: stageDTO.max_choices_per_round,
  status: stageDTO.status,
  format: stageDTO.format,
});
