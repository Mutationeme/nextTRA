import React, { useState } from "react";
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

function Select(props) {
    const [stationList, setStationList] = useState([]);

    // station list under county is sorted ascented.
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

    return (
        <Row>
            <Form.Group as={Col}>
                <Form.Label>{props.label}</Form.Label>
                <Form.Control as="select"
                    onChange={(event) => {
                        if (event.target != undefined &&
                            event.target.selectedIndex &&
                            event.target.value &&

                            // check if index in the range of 0 ~ legnth + 1 ([0]: "")
                            event.target.selectedIndex >= 0 &&
                            event.target.selectedIndex <= stations.length
                        ) {
                            // seletedIndex [0] is the default blank option
                            props.selectCounty(event.target.selectedIndex - 1);

                            //
                            setStationList(stations[event.target.selectedIndex - 1].stations);
                        }
                    }}
                    defaultValue={() => {
                        if (props.countyIdx != undefined &&
                            props.countyIdx >= 0 &&
                            props.countyIdx < stations.length
                        ) {
                            return stations[props.countyIdx].county;
                        }
                        else {
                            //default value
                            return "";
                        }
                    }}
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
                </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control as="select"
                    onChange={(event) => {
                        console.log(event);
                        if (event.target.value != undefined &&
                            event.target.value !== "" &&

                            props.countyIdx &&
                            props.countyIdx >= 0 &&
                            props.countyIdx < stations.length &&

                            event.target.selectedIndex > 0 &&
                            event.target.selectedIndex <= stations[props.countyIdx].stations.length &&
                            stations[props.countyIdx].stations[event.target.selectedIndex - 1].StationID === event.target.value
                        ) {
                            props.selectStation(event.target.value);
                        }
                    }}
                    defaultValue={() => {
                        // check if props.station in the station list.
                        if (props.countyIdx != undefined &&
                            props.countyIdx >= 0 &&
                            props.countyIdx < stations.length &&

                            props.station &&
                            props.station !== "" &&
                            // bsearch stations
                            bsearchStation(stations[props.countyIdx].stations, props.station, 0, stations[props.countyIdx].stations.length - 1) >= 0
                        ) {
                            return props.station;
                        }
                        else {
                            return "";
                        }
                    }}
                    required
                >
                    <option value=""></option>
                    {
                        // (() => {
                        //     if (
                        //         props.countyIdx != undefined &&
                        //         props.countyIdx >= 0 &&
                        //         props.countyIdx < stations.length
                        //     ) {
                        //         return (stations[props.countyIdx].stations.map((data, i) => {
                        //             console.log(data);
                        //             <option key={data.StationID} value={data.StationID}>{data.StationName.Zh_tw}</option>
                        //         }));
                        //     }
                        //     else
                        //     {
                        //         return null;
                        //     }
                        // })()

                        stationList.map((data) => {
                            return <option key={data.StationID} value={data.StationID}>{data.StationName.Zh_tw}</option>
                        })
                    }
                </Form.Control>
            </Form.Group>
        </Row>
    );
}

export default Select;