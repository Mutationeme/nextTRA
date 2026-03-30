import React, { memo, useMemo } from "react";
import stations from "../../../helpers/stationInfo/THSR/stations.json";
import "./StationSelect.css";
import textLang from "../../../helpers/languages/zh_tw.json";

function StationSelect({ label = "", stationID = "", selectStation } = {}) {
    const isSelectStationFunctionValid = (typeof selectStation === "function");
    const isInputStationIdValid = useMemo(() => stations.some(s => s.StationID === stationID), [stationID]);

    function handleStationChange(event) {
        const selectedIndex = event?.target?.selectedIndex ?? (-1);
        const val = event?.target?.value ?? "";

        if (isSelectStationFunctionValid &&
            selectedIndex > 0 &&
            selectedIndex <= stations.length &&
            stations[selectedIndex - 1].StationID === val
        ) {
            selectStation(val);
        }
    }

    function getDefaultStation() {
        if (isInputStationIdValid) {
            return stationID;
        }
        else {
            return "";
        }
    }

    const stationList = useMemo(() => {
        return (
            stations.map((data) => {
                return (<option key={data.StationUID} value={data.StationID}>{data.StationName.Zh_tw}</option>);
            })
        );
    }, []);

    if (!__PRODUCTION__) {
    }

    return (
        <div className="form-group">
            <label>{label}</label> {/* Label is now outside the select for better styling control */}
            <select
                onChange={handleStationChange}
                value={getDefaultStation()}
            >
                <option value=""></option>
                {stationList}
            </select>
        </div>
    );
}

export default memo(StationSelect);