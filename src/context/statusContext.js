import React, { useState } from "react";
import { ERRORTYPE_E } from "../helpers/type/errorType";

const StatusContext = React.createContext({
    status: ERRORTYPE_E.NO_ERROR,
    updateStatus: null
});

function StatusProvider(props) {
    const [status, updateStatus] = useState(ERRORTYPE_E.NO_ERROR);

    return (
        <StatusContext.Provider value={{
            status,
            updateStatus
        }}>
            {props.children}
        </StatusContext.Provider>
    );
}

export { StatusContext, StatusProvider };