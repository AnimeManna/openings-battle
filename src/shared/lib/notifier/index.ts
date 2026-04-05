import { useSnackbarStore } from "@/shared/model/snackbar/store";
import type { SnackbarType } from "@/shared/model/snackbar/types";

export interface NotifiaerOptions {
  timeout?: number;
}

class NotifierInstance {
  private _show(
    message: string,
    type: SnackbarType,
    options?: NotifiaerOptions,
  ) {
    useSnackbarStore.getState().show(message, type, options?.timeout);
  }

  success(message: string, options?: NotifiaerOptions) {
    this._show(message, "success", options);
  }
  error(message: string, options?: NotifiaerOptions) {
    this._show(message, "error", options);
  }
  info(message: string, options?: NotifiaerOptions) {
    this._show(message, "info", options);
  }
}

export const notifier = new NotifierInstance();
