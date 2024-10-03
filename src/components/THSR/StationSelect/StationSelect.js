import React, { memo } from "react";
import { Form, Row } from "react-bootstrap";

import stations from "../../../helpers/stationInfo/THSR/stations.json";

import "./StationSelect.css";

/*
** station: stationID, string
*/
function isValidStationID(station) {
    for (let i = 0; i < stations.length; i++) {
        if (station === stations[i].StationID) {
            return true;
        }
    }
    return false;
}

/*
** props:
**     label: string
**     station: stationID, string
**     selectStation(string): function
*/
function StationSelect(props) {

    function handleStationChange(event) {
        if (event.target.value != undefined &&
            event.target.value !== "" &&

            event.target.selectedIndex > 0 &&
            event.target.selectedIndex <= stations.length &&
            stations[event.target.selectedIndex - 1].StationID === event.target.value
        ) {
            props.selectStation(event.target.value);
        }
    }

    function getDefaultStation() {
        if (props != undefined &&
            props.station != undefined &&
            props.station !== "" &&
            isValidStationID(props.station)
        ) {
            return props.station;
        }
        return "";

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
                <Form.Label>{props.label}</Form.Label>
                <Form.Select
                    onChange={handleStationChange}
                    value={getDefaultStation()}
                    required
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