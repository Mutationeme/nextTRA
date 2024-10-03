import React, { useState } from "react";
import { ERRORTYPE_E } from "../helpers/type/errorType";

const StatusContext = React.createContext({
    status: ERRORTYPE_E.NO_ERROR
});

function StatusProvider(props) {
    const [status, setStatus] = useState(ERRORTYPE_E.NO_ERROR);

    return (
        <StatusContext.Provider value={{
            status: status
        }}>
            {props.children}
        </StatusContext.Provider>
    );
}

export { StatusProvider };