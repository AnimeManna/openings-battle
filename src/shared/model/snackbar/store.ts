import { create } from "zustand";
import type { SnackbarType } from "./types";

interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
  timerId: ReturnType<typeof setTimeout> | null;

  show: (message: string, type?: SnackbarType, duration?: number) => void;
  close: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set, get) => ({
  isOpen: false,
  message: "",
  type: "info",
  timerId: null,

  show: (message, type = "info", duration = 3000) => {
    const { timerId } = get();
    if (timerId) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(() => {
      get().close();
    }, duration);

    set({
      isOpen: true,
      message,
      type,
      timerId: newTimerId,
    });
  },

  close: () => {
    set({ isOpen: false });
  },
}));
