import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

import "./NotifyToastItem.css";

const HIDE_DELAY = __PRODUCTION__ ? 3000 : 30000;

function NotifyToastItem(props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Defer visibility to avoid forced layout during initial page load
        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
        }, HIDE_DELAY);
        return () => clearTimeout(timer);
    }, []);

    function closeNotify() {
        setShow(false);
    }

    if (!show){
        return null;
    }

    return (
        <div className="toast danger">
            <div className="toast-content">
                <span className="toast-message">
                    {props.message}
                </span>
                <button className="toast-close" onClick={closeNotify}>
                    <IoMdClose size="18" />
                </button>
            </div>
        </div>
    );
}

export default NotifyToastItem;