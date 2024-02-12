import React from "react";
import { Form, Row, Col } from "react-bootstrap";

import stations from '../../stationInfo/stations.json';;

/*
** props:
**   label: string
*/

function Select(props) {
    const [stations, setStations] = setState({
        county: "",
        stationList: []
    });

    return (
        <Row>
            <Form.Group as={Col}>
                <Form.Label>{props.label}</Form.Label>
                <Form.Control as="select"
                    onChange={(event) => {
                        if (event.target.value !== "") {
                            setCounty([event.target.value, county[1]]);
                            setList([stations[event.target.value].stations, stationList[1]]);
                        }
                        else {
                            setCounty([null, county[1]]);
                            setList([[], stationList[1]]);
                        }
                        setDepart("");
                    }}
                    value={county[0]}
                    required
                >
                    <option value=""></option>
                    {
                        stations.map((data, i) => {
                            return (
                                <option key={i} value={i}>{data.county}</option>
                            );
                        })
                    }
                </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control as="select"
                    onChange={(event) => {
                        setDepart(event.target.value);
                    }}
                    value={departure}
                    required
                >
                    <option value=""></option>
                    {
                        stationList[0].map((data, i) => {
                            return (
                                <option key={i} value={data.StationID}>{data.StationName.Zh_tw}</option>
                            );
                        })
                    }
                </Form.Control>
            </Form.Group>
        </Row>
    );
}

export default Select;