import * as React from "react";
import { useEffect } from "react";
import { SnackbarNotificationMessage } from "../models/snackbar-notification-models";
import { AlertColor } from "@mui/material/Alert/Alert";
import { log } from "../util/logging-config";
import { useRecoilState } from "recoil";
import { snackbarMessageState } from "../atoms/snackbar-atoms";
import { isEqual, isUndefined, omit } from "lodash";


export default function useSnackbar() {

    const [state, setState] = useRecoilState<SnackbarNotificationMessage>(snackbarMessageState);

    useEffect(() => {
        log.debug("state:", state);
    }, [state]);


    function info(message: any, autoHide?: boolean, onClose?: () => any) {
        showNotification("info", message, autoHide, onClose);
    }

    function success(message: any, autoHide?: boolean, onClose?: () => any) {
        showNotification("success", message, autoHide, onClose);
    }

    function warning(message: any, autoHide?: boolean, onClose?: () => any) {
        showNotification("warning", message, autoHide, onClose);
    }

    function error(message: any, autoHide?: boolean, onClose?: () => any) {
        showNotification("error", message, autoHide, onClose);
    }

    function showNotification(variant: AlertColor, message: any, autoHide?: boolean, onClose?: () => any) {
        const newState = {variant, message, open: true, autoHide: isUndefined(autoHide) ? true : autoHide, onClose};
        if (!isEqual(omit(state, "onClose"), omit(newState, "onClose"))) {
            log.debug("setting new state:", newState);
            setState(newState);
        } else {
            log.debug("no change to state:", newState);
        }
    }

    return {info, success, warning, error};
}
