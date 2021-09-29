import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { SnackbarNotificationMessage } from "../models/snackbar-notification-models";

export const snackbarMessageState = atom<SnackbarNotificationMessage>({
  key: StoredValue.SNACKBAR_MESSAGE,
  default: {
    variant: "info",
    open: false,
    message: "",
    autoHide: true,
    onClose: null
  }
});

export const showVerifyEmailState = atom<boolean>({
  key: StoredValue.SHOW_VERIFY_EMAIL,
  default: false
});

export const loginSubmittedCountState = atom<number>({
  key: StoredValue.LOGIN_SUBMITTED_COUNT,
  default: 0
});
