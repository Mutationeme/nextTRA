import React, { memo } from "react";
import { Form, Row } from "react-bootstrap";

import stations from "../../../helpers/stationInfo/THSR/stations.json";

import "./StationSelect.css";

function StationSelect({ label = "", stationID = "", selectStation } = {}) {
    const isSelectStationFunctionValid = (typeof selectStation === "function");
    let isInputStationIdValid = false;
    if (stationID !== "") {
        for (let i = 0; i < stations.length; i++) {
            if (stationID === stations[i].StationID) {
                isInputStationIdValid = true;
                break;
            }
        }
    }

    function handleStationChange(event) {
        if (isSelectStationFunctionValid &&
            
            event !== undefined &&
            event.target !== undefined &&
            event.target.value !== undefined &&
            event.target.selectedIndex !== undefined &&

            event.target.selectedIndex > 0 &&
            event.target.selectedIndex <= stations.length &&
            stations[event.target.selectedIndex - 1].StationID === event.target.value 
        ) {
            selectStation(event.target.value);
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

    function setStationList() {
        return (
            stations.map((data) => {
                return (<option key={data.StationUID} value={data.StationID}>{data.StationName.Zh_tw}</option>);
            })
        );
    }

    if (!__PRODUCTION__) {
    }

    return (
        <Row>
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Select
                    onChange={handleStationChange}
                    value={getDefaultStation()}
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

export default memo(StationSelect);