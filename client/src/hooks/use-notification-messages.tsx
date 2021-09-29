import firebase from "firebase";
import { ContactUs } from "../pages/common/ContactUs";
import useSnackbar from "./use-snackbar";

export default function useNotificationMessages() {

    const notification = useSnackbar();

    function showNewUserRegistered(user: firebase.User, onClose: () => any): void {
        const message = `${user?.email} has been successfully registered but need to be verified by responding to an email in your inbox. Once you have done this, our user Administration team will enable system access for you and you will receive an email when this is complete.`;
        notification.success(<>{message}. <ContactUs/></>, false, onClose);
    }

    function showVerificationNotification(user: firebase.User, onClose: () => any): void {
        const message = `${user?.email} has not yet been verified so please respond to an email in your inbox`;
        notification.warning(<>{message}. <ContactUs/></>, false, onClose);
    }

    function showNoSystemAccessNotification(user: firebase.User, onClose: () => any): void {
        const message = `${user?.email} has not yet been granted system access. You will receive an email when this is complete`;
        notification.warning(<>{message}. <ContactUs/></>, false, onClose);
    }

    function showVerificationSent(user: firebase.User, onClose: () => any): void {
        const message = `Verification email has been sent to ${user.email} so please respond to an email in your inbox, then try logging in again`;
        notification.warning(message, false, onClose);
    }

    function showCantSendVerificationEmail(onClose: () => any): void {
        notification.error("Verification email could not be sent. Refresh your browser and try again", false);
    }

    function showRegistrationError(error): void {
        const registrationError = error?.code === "auth/email-already-in-use"
            ? <>There is already an account associated with this email address. You can either:
                <li>Click the Log in link and login with these details.</li>
                <li>Register again with different details.</li></>
            : "Unexpected error occurred when registering account";
        notification.error(registrationError, false);
    }

    return {
        showVerificationNotification,
        showNoSystemAccessNotification,
        showVerificationSent,
        showCantSendVerificationEmail,
        showNewUserRegistered,
        showRegistrationError
    };
}
