import React, { useState, useEffect, memo, useMemo } from "react";
import "./CountyStationSelect.css";

let stations = null;
const stationsPromise = import(
    /* webpackChunkName: "tra-stations" */
    /* webpackPreload: true */
    "../../../helpers/stationInfo/TRA/stations.json"
).then(module => {
    stations = module.default;
});

// Station list under county is sorted ascented.
// Binary search the target stationID and return the station index.
function bsearchStationIdx(array, targetStationID, start, end) {
    if ((start > end) || (targetStationID === "")) {
        return -1;
    }

    let mid = Math.floor((start + end) / 2);
    let midStationID = array[mid].StationID;

    if (midStationID === targetStationID) {
        return mid;
    }
    else {
        if (parseInt(midStationID, 10) < parseInt(targetStationID, 10)) {
            return bsearchStationIdx(array, targetStationID, mid + 1, end);
        }
        else {
            return bsearchStationIdx(array, targetStationID, start, mid - 1);
        }
    }
}

function CountyStationSelect({ label = "", countyIdx = -1, stationID = "", selectCounty, selectStation } = {}) {
    const [isReady, setIsReady] = useState(stations !== null);
    useEffect(() => {
        if (!isReady) {
            stationsPromise.then(() => setIsReady(true));
        }
    }, []);

    const isInputCountyIdxValid = isReady ? ((countyIdx >= 0) && (countyIdx < stations.length)) : false;
    const isSelectCountyFunctionValid = (typeof selectCounty === "function");
    const isSelectStationFunctionValid = (typeof selectStation === "function");

    function getDefaultCounty() {
        if (isInputCountyIdxValid) {
            return stations[countyIdx].county;
        }
        else {
            return "";
        }
    }

    function getDefaultStation() {
        if (isInputCountyIdxValid &&
            // bsearch stationIdx by stationID
            bsearchStationIdx(stations[countyIdx].stations, stationID, 0, stations[countyIdx].stations.length - 1) >= 0
        ) {
            return stationID;
        }
        else {
            return "";
        }
    }

    const countyList = useMemo(() => {
        if (!isReady) {
            return null;
        }

        return (
            stations.map((data, i) => {
                return (
                    <option key={i} value={data.county}>{data.county}</option>
                );
            })
        );
    }, [isReady]);

    const stationList = useMemo(() => {
        if (isInputCountyIdxValid) {
            return (
                stations[countyIdx].stations.map((data, i) => {
                    return (<option key={i} value={data.StationID}>{data.StationName.Zh_tw}</option>);
                })
            );
        }
        else {
            return null;
        }
    }, [countyIdx]);

    function handleCountyChange(event) {
        const index = event?.target?.selectedIndex ?? (-1);

        if (isSelectCountyFunctionValid &&
            // check if index in the range of 1 ~ length
            // seletedIndex [0] is the default blank option ([0]: "")
            isReady &&
            index > 0 &&
            index <= stations.length
        ) {
            // selectedIndex - 1: selectedIndex to countyIndex
            selectCounty(index - 1);
        }
    }

    function handleStationChange(event) {
        const stationID = event?.target?.value ?? "";
        const index = event?.target?.selectedIndex ?? (-1);

        if (isSelectStationFunctionValid &&
            isInputCountyIdxValid &&
            // check if index in the range of 1 ~ legnth ([0]: "")
            index > 0 &&
            index <= stations[countyIdx].stations.length &&
            stations[countyIdx].stations[index - 1].StationID === stationID
        ) {
            selectStation(stationID);
        }
    }

    return (
        <div className="horizontal-group">
            <div className="form-group flex-1">
                <label>{label}</label>
                <select
                    onChange={handleCountyChange}
                    value={getDefaultCounty()}
                    disabled={!isReady}
                >
                    <option value=""></option>
                    {countyList}
                </select>
            </div>
            <div className="form-group flex-1">
                <label>&nbsp;</label>
                <select
                    onChange={handleStationChange}
                    value={getDefaultStation()}
                    disabled={!isInputCountyIdxValid}
                >
                    <option value=""></option>
                    {stationList}
                </select>
            </div>
        </div>
    );
}

export default memo(CountyStationSelect);