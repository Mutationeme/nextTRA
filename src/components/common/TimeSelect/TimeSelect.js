import React, { memo } from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import { timeFormat, addDays } from "../../../helpers/time";

// Language: zh_tw
import textLang from "../../../helpers/languages/zh_tw.json";

function TimeSelect({ time = new Date(), selectTime } = {}) {
    const isSelectTimeFunctionValid = (typeof selectTime === "function");

    // Development mode
    if (!__PRODUCTION__) {
    }
    // End of development mode code

    return (
        <Row>
            <Form.Group as={Col}>
                <Form.Label>{textLang.Date}</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="datetime-local"
                        value={
                            // default time value
                            timeFormat(time)
                        }
                        min={timeFormat(new Date()).slice(0, 10) + "T00:00"}
                        max={
                            // PTX API only provide date within 60 days
                            timeFormat(addDays(new Date(), 60)).slice(0, 10) + "T23:59"
                        }
                        onChange={
                            (event) => {
                                if (isSelectTimeFunctionValid) {
                                    selectTime(new Date(event.target.value));
                                }
                            }
                        }
                    />
                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={
                            () => {
                                if (isSelectTimeFunctionValid) {
                                    selectTime(new Date());
                                }
                            }
                        }
                    >
                        {textLang.Now}
                    </Button>
                </InputGroup>
            </Form.Group>
        </Row>
    );
}

export default memo(TimeSelect);