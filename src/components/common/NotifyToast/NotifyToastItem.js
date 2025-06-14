import React, { useState } from "react";

import Toast from "react-bootstrap/Toast";
import CloseButton from "react-bootstrap/CloseButton";

function NotifyToastItem(props) {
    const [show, setShow] = useState(true);
    // millisecond
    let hideDelay = 3000;

    if (!__PRODUCTION__) {
        hideDelay = hideDelay * 10;
    }

    function closeNotify(){
        setShow(false);
    }

    return (
        <Toast
            className="align-items-center bg-opacity-75"
            bg="danger"
            onClose={closeNotify}
            show={show}
            delay={hideDelay}
            autohide
        >
            <div className="d-flex">
                <Toast.Body className="text-white">
                    Error: {props.message}
                </Toast.Body>
                <CloseButton data-bs-dismiss="toast" className="me-2 m-auto" variant="white"></CloseButton>
            </div>
        </Toast>
    );

}

export default NotifyToastItem;