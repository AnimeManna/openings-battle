import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Duration } from "dayjs/plugin/duration";

export const getDurationBetweenDates = (
  firstDate: Dayjs,
  secondDate: Dayjs,
): Duration => dayjs.duration(secondDate.diff(firstDate));
