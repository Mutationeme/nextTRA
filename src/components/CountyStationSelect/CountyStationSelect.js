import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

import stations from '../../stationInfo/stations.json';

/*
** props:
**     label: string
**     countyIdx: int; deafult: -1
**     station: stationID
**     selectCounty(index): function; index: -1 ~ (countyLength - 1)
**     selectStation(string): function
*/

function CountyStationSelect(props) {

    useEffect(() => {
        //console.log(props);
    }, [props, props.countyIdx]);

    // Station list under county is sorted ascented.
    // Binary search the target station information.
    function bsearchStation(array, target, start, end) {
        if (start > end) {
            return -1;
        }

        let mid = Math.floor((start + end) / 2);
        let midStationID = array[mid].StationID;

        if (midStationID === target) {
            return mid;
        }
        else {
            if (parseInt(midStationID, 10) < parseInt(target, 10)) {
                return bsearchStation(array, target, mid + 1, end);
            }
            else {
                return bsearchStation(array, target, start, mid - 1);
            }
        }
    }

    function getDefaultCounty() {
        if (props.countyIdx != undefined &&
            props.countyIdx >= 0 &&
            props.countyIdx < stations.length
        ) {
            return stations[props.countyIdx].county;
        }
        else {
            return "";
        }
    }

    function getDefaultStation() {
        if (props.countyIdx != undefined &&
            props.countyIdx >= 0 &&
            props.countyIdx < stations.length &&

            props.station != undefined &&
            props.station !== "" &&
            // bsearch stations
            bsearchStation(stations[props.countyIdx].stations, props.station, 0, stations[props.countyIdx].stations.length - 1) >= 0
        ) {
            return props.station;
        }
        else {
            return "";
        }
    }

    function setStationListByCountyIdx(countyIdx) {
        if (countyIdx != undefined &&
            countyIdx >= 0 &&
            countyIdx < stations.length
        ) {
            return (
                stations[countyIdx].stations.map((data, i) => {
                    return <option key={i} value={data.StationID}>{data.StationName.Zh_tw}</option>;
                })
            );
        }
        else {
            return null;
        }
    }

    function handleCountyChange(event) {
        if (event.target != undefined &&
            event.target.selectedIndex != undefined &&
            event.target.value != undefined &&

            // check if index in the range of 0 ~ legnth + 1 ([0]: "")
            event.target.selectedIndex >= 0 &&
            event.target.selectedIndex <= stations.length
        ) {
            // seletedIndex [0] is the default blank option
            props.selectCounty(event.target.selectedIndex - 1);
        }
    }

    function handleStationChange(event) {
        if (event.target.value != undefined &&
            event.target.value !== "" &&

            props.countyIdx != undefined &&
            props.countyIdx >= 0 &&
            props.countyIdx < stations.length &&

            event.target.selectedIndex > 0 &&
            event.target.selectedIndex <= stations[props.countyIdx].stations.length &&
            stations[props.countyIdx].stations[event.target.selectedIndex - 1].StationID === event.target.value
        ) {
            props.selectStation(event.target.value);
        }
    }

    return (
        <Row>
            <Form.Group as={Col}>
                <Form.Label>{props.label}</Form.Label>
                <Form.Select
                    onChange={handleCountyChange}
                    value={getDefaultCounty()}
                    required
                >
                    <option value=""></option>
                    {
                        stations.map((data, i) => {
                            return (
                                <option key={i} value={data.county}>{data.county}</option>
                            );
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Select
                    onChange={handleStationChange}
                    value={getDefaultStation()}
                    required
                >
                    <option value=""></option>
                    {
                        setStationListByCountyIdx(props.countyIdx)
                    }
                </Form.Select>
            </Form.Group>
        </Row>
    );
}

export default CountyStationSelect;