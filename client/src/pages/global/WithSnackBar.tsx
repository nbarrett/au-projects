import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { TransitionProps } from "@mui/material/transitions/transition";
import { Slide } from "@mui/material";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { SnackbarNotificationMessage } from "../../models/snackbar-notification-models";
import { snackbarMessageState } from "../../atoms/snackbar-atoms";
import { log } from "../../util/logging-config";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="up"/>;
}

export function WithSnackBar(props: { children: any }) {

    const message = useRecoilValue<SnackbarNotificationMessage>(snackbarMessageState);
    const reset = useResetRecoilState(snackbarMessageState);

    function onClose(event?: React.SyntheticEvent, reason?: string) {
        log.debug("onClose:", reason);
        if (reason !== "clickaway") {
            reset();
            log.debug("onClose:with supplied handler", message.onClose,"reason:", reason);
            if (message.onClose) {
                message.onClose();
            }
        }
    }

    return <>{props.children}
        <Snackbar open={message.open} autoHideDuration={message.autoHide ? 6000 : null}
                  onClose={onClose}
                  anchorOrigin={{vertical: "bottom", horizontal: "center",}}
                  TransitionComponent={SlideTransition}>
            <Alert onClose={onClose} severity={message.variant} sx={{width: "100%"}}>
                {message.message}
            </Alert>
        </Snackbar>
    </>;
}
