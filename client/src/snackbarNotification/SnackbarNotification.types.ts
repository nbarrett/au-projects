import { AlertColor } from "@material-ui/core/Alert/Alert";

export type SnackbarNotificationContextState = {
  variant: AlertColor;
  isOpen: boolean;
  message: string;
};

export type SnackbarNotificationContext = SnackbarNotificationContextState & {
  info: (message: string) => void;
  success: (message: string) => void;
  warning: (message: any) => void;
  error: (message: string) => void;
  closeNotification: VoidFunction;
};
