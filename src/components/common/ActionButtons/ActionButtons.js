import React, { memo, useContext } from "react";

import "./ActionButtons.css";
import { getTrainByDate as getTRATrainByDate } from "../../../request/traReq.js";
import { getTrainByDate as getTHSRTrainByDate } from "../../../request/thsrReq.js";
import { RAILTYPE_E } from "../../../helpers/type/railType.js";

import { notifyError } from "../../common/NotifyToast/NotifyToast.js";
import { StatusContext } from "../../../context/statusContext.js";

import { BsArrowDownUp, BsSearch } from "react-icons/bs";
import { ERRORTYPE_E } from "../../../helpers/type/errorType.js";

function ActionButtons({
    railType = RAILTYPE_E.NO_RAIL,
    originStationID = "",
    destinationStationID = "",
    time = new Date(),
    handleSwap,
    handleSubmit
} = {}) {
    const isHandleSwapFunctionValid = (typeof handleSwap === "function");
    const isHandleSubmitFunctionValid = (typeof handleSubmit === "function");
    const isInputTimeValid = (time instanceof Date);

    const { status, updateStatus } = useContext(StatusContext);

    async function requestTrains() {
        let reqOptions = {
            departure: originStationID,
            arrival: destinationStationID,
            date: time
        };
        let resultJson = null;

        if (reqOptions.departure === "" ||
            reqOptions.arrival === "" ||
            !isInputTimeValid
        ) {
            notifyError(ERRORTYPE_E.REQ_OPTION_ERROR);
            updateStatus(ERRORTYPE_E.REQ_OPTION_ERROR);
        }
        else {
            try {
                if (railType === RAILTYPE_E.TRA) {
                    resultJson = await getTRATrainByDate(reqOptions);
                }
                else if (railType === RAILTYPE_E.THSR) {
                    resultJson = await getTHSRTrainByDate(reqOptions);
                }
                updateStatus(ERRORTYPE_E.NO_ERROR);

                if (resultJson !== null && isHandleSubmitFunctionValid) {
                    handleSubmit(resultJson, { time: reqOptions.date });
                }
            }
            catch (error) {
                resultJson = null;
                notifyError(error.message);
                updateStatus(error.message);
            }
        }
    }

    // Development mode only
    if (!__PRODUCTION__) {
    }
    // End of development mode code

    return (
        <div className="action-buttons-group">
            <div className="btn-col-swap">
                <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => {
                        if (isHandleSwapFunctionValid) {
                            handleSwap();
                        }
                    }}
                >
                    <BsArrowDownUp />
                </button>
            </div>
            <div className="btn-col-search">
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={requestTrains}
                >
                    <BsSearch />
                </button>
            </div>
        </div>
    );
}

export default memo(ActionButtons);