import React, { memo } from "react";
import { Form, Row, Col } from "react-bootstrap";

import stations from "../../../helpers/stationInfo/TRA/stations.json";

import "./CountyStationSelect.css";


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
    const isInputCountyIdxValid = (countyIdx >= 0) && (countyIdx < stations.length);
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

    function setCountyList() {
        return (
            stations.map((data, i) => {
                return (
                    <option key={i} value={data.county}>{data.county}</option>
                );
            })
        );
    }

    function setStationList() {
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
    }

    function handleCountyChange(event) {
        if (isSelectCountyFunctionValid &&

            event != undefined &&
            event.target != undefined &&
            event.target.selectedIndex != undefined &&

            // check if index in the range of 1 ~ length
            // seletedIndex [0] is the default blank option ([0]: "")
            event.target.selectedIndex > 0 &&
            event.target.selectedIndex <= stations.length
        ) {
            // selectedIndex - 1: selectedIndex to countyIndex
            selectCounty(event.target.selectedIndex - 1);
        }
    }

    function handleStationChange(event) {
        if (isSelectStationFunctionValid &&

            event != undefined &&
            event.target != undefined &&
            event.target.value != undefined &&
            event.target.selectedIndex != undefined &&

            isInputCountyIdxValid &&

            // check if index in the range of 1 ~ legnth ([0]: "")
            event.target.selectedIndex > 0 &&
            event.target.selectedIndex <= stations[countyIdx].stations.length &&
            stations[countyIdx].stations[event.target.selectedIndex - 1].StationID === event.target.value
        ) {
            selectStation(event.target.value);
        }
    }

    // Development mode only
    if (!__PRODUCTION__) {
    }
    // End of development mode code

    return (
        <Row>
            <Form.Group as={Col}>
                <Form.Label>{label}</Form.Label>
                <Form.Select
                    onChange={handleCountyChange}
                    value={getDefaultCounty()}
                >
                    <option value=""></option>
                    {
                        setCountyList()
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Select
                    onChange={handleStationChange}
                    value={getDefaultStation()}
                    disabled={!isInputCountyIdxValid}
                >
                    <option value=""></option>
                    {
                        setStationList()
                    }
                </Form.Select>
            </Form.Group>
        </Row>
    );
}

export default memo(CountyStationSelect);