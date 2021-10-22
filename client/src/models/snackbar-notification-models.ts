import { AlertColor } from "@mui/material/Alert/Alert";

export interface SnackbarNotificationMessage {
  variant: AlertColor;
  open: boolean;
  message: any;
  autoHide?: boolean;
  onClose?: () => any;
}
