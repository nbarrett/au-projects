import { Color } from '@material-ui/core/Alert/Alert';

export type SnackbarNotificationContextState = {
  variant: Color;
  isOpen: boolean;
  message: string;
};

export type SnackbarNotificationContext = SnackbarNotificationContextState & {
  info: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  closeNotification: VoidFunction;
};
