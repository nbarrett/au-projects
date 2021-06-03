import { ReactNode, useState } from "react";
import { SnackbarNotification } from "./SnackbarNotification";
import { SnackbarNotificationContextState, } from "./SnackbarNotification.types";
import { SnackbarNotificationContext } from "./SnackbarNotificationContext";
import { Color } from '@material-ui/core/Alert/Alert';

type SnackbarNotificationProviderProps = {
  children: ReactNode;
};

export const SnackbarNotificationProvider = ({
  children,
}: SnackbarNotificationProviderProps) => {
  const [state, setState] = useState<SnackbarNotificationContextState>({
      variant: "info",
      isOpen: false,
      message: "",
  });

  const showNotification = (
      variant: Color,
      message: string
  ) => {
    setState({
      variant,
      message,
      isOpen: true,
    });
  };

  const closeNotification = () => {
    setState({
      ...state,
      isOpen: false,
    });
  };

  return (
    <SnackbarNotificationContext.Provider
      value={{
          ...state,
          info: (message) =>
              showNotification("info", message),
          success: (message) =>
              showNotification("success", message),
          warning: (message) =>
              showNotification("warning", message),
          error: (message) =>
              showNotification("error", message),
          closeNotification,
      }}
    >
      <SnackbarNotification />
      {children}
    </SnackbarNotificationContext.Provider>
  );
};
