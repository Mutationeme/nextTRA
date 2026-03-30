import React, { memo } from "react";

import { timeFormat, addDays } from "../../../helpers/time";

// Language: zh_tw
import textLang from "../../../helpers/languages/zh_tw.json";

function TimeSelect({ time = new Date(), selectTime } = {}) {
    const isSelectTimeFunctionValid = (typeof selectTime === "function");

    // Development mode
    if (!__PRODUCTION__) {
    }
    // End of development mode code

    return (
        <div className="form-group">
            <label>{textLang.Date}</label>
            <div className="input-group">
                <input
                    type="datetime-local"
                    value={
                        // default time value
                        timeFormat(time)
                    }
                    min={timeFormat(new Date()).slice(0, 10) + "T00:00"}
                    max={
                        // PTX API only provide date within 60 days
                        timeFormat(addDays(new Date(), 60)).slice(0, 10) + "T23:59"
                    }
                    onChange={
                        (event) => {
                            if (isSelectTimeFunctionValid) {
                                selectTime(new Date(event.target.value));
                            }
                        }
                    }
                />
                <button
                    className="btn btn-outline btn-append"
                    type="button"
                    onClick={() => {
                        if (isSelectTimeFunctionValid) {
                            selectTime(new Date());
                        }
                    }}
                >
                    {textLang.Now}
                </button>
            </div>
        </div>
    );
}

export default memo(TimeSelect);