import React, { memo } from "react";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { timeFormat } from "../../time";

/*
** props:
**        time: Date object
**        selectTime: function
*/
function TimeSelect(props) {

    function addDay(currentDate, days) {
        let result = new Date(currentDate);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Development mode
    if (!__PRODUCTION__) {
        //console.log(props);
    }
    // End of development mode code

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
                            // PTX API only provide date within 60 days
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

export default memo(TimeSelect);