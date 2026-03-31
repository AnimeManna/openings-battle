import { getDurationBetweenDates } from "@/shared/helpers/getDurationBetweenDates";
import dayjs from "dayjs";

export const isRoundAvalaibleByTime = (roundStartAtTime: string) =>
  getDurationBetweenDates(
    dayjs.utc(),
    dayjs.utc(roundStartAtTime),
  ).asMilliseconds() < 0;
