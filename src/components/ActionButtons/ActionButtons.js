import React, { memo } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

import { getTrainByDate } from "../../request/index.js";

import "./ActionButtons.css";

/*
** props:
**      scheduleOptions
**      handleSwap
**      handleSubmit
*/
function ActionButtons(props) {

    
    async function requestTrains() {
        // let resultJson = getTrainByDate({
        //     departure: props.scheduleOptions.origin.stationID,
        //     arrival: props.scheduleOptions.destination.stationID,
        //     date: props.scheduleOptions.time
        // }).then((res) => {
        //     props.handleSubmit(res, props.scheduleOptions);
        // })

        let resultJson = await getTrainByDate({
            departure: props.scheduleOptions.origin.stationID,
            arrival: props.scheduleOptions.destination.stationID,
            date: props.scheduleOptions.time
        });
        props.handleSubmit(resultJson, props.scheduleOptions);
    }

    // Development mode only
    if (!__PRODUCTION__) {
        console.log(props);
    }
    // End of development mode code

    return (
        <Row>
            <Form.Group as={Col} xs="4">
                <Form.Label>&nbsp;</Form.Label>
                <Button
                    variant="outline-info"
                    type="button"
                    size="lg"
                    className="fullWidth"
                    onClick={props.handleSwap}
                >
                    Swap
                </Button>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>&nbsp;</Form.Label>
                <Button
                    variant="dark"
                    type="button"
                    size="lg"
                    className="fullWidth"
                    onClick={requestTrains /*props.handleSubmit*/}
                >
                    Submit
                </Button>
            </Form.Group>
        </Row>
    );
}

export default memo(ActionButtons);