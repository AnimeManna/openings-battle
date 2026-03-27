import { getDurationBetweenDates } from "@/shared/helpers/getDurationBetweenDates";
import dayjs from "dayjs";
import type { Duration } from "dayjs/plugin/duration";

export interface DurationManagerItem {
  id: string;
  endTime: string;
  onTick: (duration: Duration) => void;
  onFinish: (duration: Duration) => void;
}

class DurationManager {
  private _subscribers: Map<string, DurationManagerItem>;
  private _timeoutId: ReturnType<typeof setTimeout> | null;

  constructor() {
    this._subscribers = new Map();
    this._timeoutId = null;
  }

  subscribe(item: DurationManagerItem) {
    this._subscribers.set(item.id, item);
    if (this._subscribers.size === 1) {
      this._tick();
    }
  }

  unsubscribe(id: string) {
    this._subscribers.delete(id);
  }

  private _tick() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    if (this._subscribers.size === 0) {
      return;
    }

    this._timeoutId = setTimeout(() => {
      const now = dayjs().utc();
      this._subscribers.forEach((sub) => {
        const duration = getDurationBetweenDates(now, dayjs(sub.endTime));
        if (duration.asMilliseconds() <= 0) {
          sub.onFinish(duration);
          this.unsubscribe(sub.id);
        } else {
          sub.onTick(duration);
        }
      });

      this._tick();
    }, 1000);
  }
}

export const durationManager = new DurationManager();
