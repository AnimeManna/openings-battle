import type { Round } from "../model/types";
import { isRoundAvalaibleByTime } from "./isRoundAvalaibleByTime";

export const isRoundAvlaible = (round?: Round) => {
  if (!round) return false;
  return round.status === "completed" || isRoundAvalaibleByTime(round.startAt);
};
