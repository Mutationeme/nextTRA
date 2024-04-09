import React, { useState } from "react";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";

/*
** props:
**        time: Date object
**        selectTime: function
*/
function TimeSelect(props) {
    /*
    ** time: Date object
    */
    function timeFormat(time) {
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let dat = time.getDate();
        if (dat < 10) {
            dat = '0' + dat;
        }
        let hour = time.getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }
        let minute = time.getMinutes();
        if (minute < 10) {
            minute = '0' + minute;
        }

        return year + '-' + month + '-' + dat + 'T' + hour + ':' + minute;
    }

    function addDay(currentDate, days) {
        let result = new Date(currentDate);
        result.setDate(result.getDate() + days);
        return result;
    }

    return (
        <Row>
            <Form.Group as={Col}>
                <Form.Label>Date</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="datetime-local"
                        value={
                            // default time value
                            timeFormat(props.time)
                        }
                        min={timeFormat(new Date()).slice(0, 10) + "T00:00"}
                        max={
                            //PTX API only provide date within 60 days
                            timeFormat(addDay(new Date(), 60)).slice(0, 10) + "T23:59"
                        }
                        onChange={
                            (event) => {
                                props.selectTime(new Date(event.target.value));
                            }
                        }
                    />
                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={
                            () => { props.selectTime(new Date()) }
                        }
                    >
                        Now
                    </Button>
                </InputGroup>
            </Form.Group>
        </Row>
    );
}

export default TimeSelect;