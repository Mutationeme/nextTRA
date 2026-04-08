import React, { memo, useMemo, useState, useEffect } from "react";
import "./StationSelect.css";

let stations = null;
const stationsPromise = import(
    /* webpackChunkName: "thsr-stations" */
    /* webpackPreload: true */
    "../../../helpers/stationInfo/THSR/stations.json"
).then(module => {
    stations = module.default;
});

function StationSelect({ label = "", stationID = "", selectStation } = {}) {
    const [isReady, setIsReady] = useState(stations !== null);

    useEffect(() => {
        if (!isReady) {
            stationsPromise.then(() => setIsReady(true));
        }
    }, []);

    const isSelectStationFunctionValid = (typeof selectStation === "function");
    const isInputStationIdValid = useMemo(() => {
        if (!isReady) {
            return false;
        }
        return stations.some(s => s.StationID === stationID);
    }, [stationID, isReady]);

    function handleStationChange(event) {
        const selectedIndex = event?.target?.selectedIndex ?? (-1);
        const val = event?.target?.value ?? "";

        if (isSelectStationFunctionValid &&
            isReady &&
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
        if (!isReady) {
            return null;
        }

        return (
            stations.map((data) => {
                return (<option key={data.StationUID} value={data.StationID}>{data.StationName.Zh_tw}</option>);
            })
        );
    }, [isReady]);

    return (
        <div className="form-group">
            <label>{label}</label> {/* Label is now outside the select for better styling control */}
            <select
                onChange={handleStationChange}
                value={getDefaultStation()}
                disabled={!isReady}
            >
                <option value=""></option>
                {stationList}
            </select>
        </div>
    );
}

export default memo(StationSelect);