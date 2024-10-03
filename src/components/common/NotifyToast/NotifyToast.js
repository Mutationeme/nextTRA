import React from "react";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function notifyMessage(message) {
    toast(message);
}

function notifyError(message) {
    toast.error(message);
}

function NotifyToast() {
    let autoCloseMs = 3000;

    if (!__PRODUCTION__) {

        autoCloseMs = autoCloseMs * 10;
    }

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={autoCloseMs}
            hideProgressBar
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
            transition={Slide}
            stacked
        />
    );
}

export { NotifyToast, notifyMessage, notifyError };
