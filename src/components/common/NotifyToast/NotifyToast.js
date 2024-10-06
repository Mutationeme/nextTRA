import React from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { ERRORTYPE_E } from "../../../helpers/type/errorType";

// Language: zh_tw
import textLang from "../../../helpers/languages/zh_tw.json";

function notifyMessage(message) {
    toast(message);
}

function notifyError(message) {
    if (message === ERRORTYPE_E.REQ_OPTION_ERROR) {
        message = textLang.ReqOptErrMsg
    }
    else if (message === ERRORTYPE_E.FETCH_ERROR) {
        message = textLang.FetchErrMsg;
    }

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
