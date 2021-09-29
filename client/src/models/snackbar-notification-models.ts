import { AlertColor } from "@material-ui/core/Alert/Alert";

export interface SnackbarNotificationMessage {
  variant: AlertColor;
  open: boolean;
  message: any;
  autoHide?: boolean;
  onClose?: () => any;
}
