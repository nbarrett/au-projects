import { AlertProps, Slide, Snackbar, } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { useSnackbarNotification } from "./SnackbarNotificationContext";
import MuiAlert from '@material-ui/core/Alert';
import React from 'react';
import { log } from '../util/logging-config';

function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="up"/>;
}

export const SnackbarNotification = () => {
    const {
        isOpen,
        message,
        variant,
        closeNotification,
    } = useSnackbarNotification();
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    log.info("variant:", variant,)
    return (
        <Snackbar
            anchorOrigin={{vertical: "bottom", horizontal: "center",}}
            TransitionComponent={SlideTransition}
            open={isOpen}
            autoHideDuration={5000}
            onClose={closeNotification}>
            <Alert onClose={closeNotification} severity={variant} sx={{width: '100%'}}>
                {message}
                </Alert>
        </Snackbar>
    );
};
