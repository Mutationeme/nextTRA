import React, { memo, useEffect, useState } from "react";
import "./ActionButtons.css";

import { Row, Col, Form, Button } from "react-bootstrap";

import { getTrainByDate as getTRATrainByDate } from "../../../request/traReq.js";
import { getTrainByDate as getTHSRTrainByDate } from "../../../request/thsrReq.js";
import { RAILTYPE_E } from "../../../helpers/type/railType.js";

import { notifyMessage, notifyError } from "../../common/NotifyToast/NotifyToast.js";

// Bootstrap icons
/*!
 * Bootstrap Icons v1.11.3 (https://icons.getbootstrap.com/)
 * Copyright 2019-2024 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/icons/blob/main/LICENSE)
 */
import { BsArrowDownUp, BsSearch } from "react-icons/bs";

/*
** props:
**      scheduleOptions
**      handleSwap
**      handleSubmit
**      railType
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

        if (props === undefined || props.railType === undefined) {
            return;
        }

        let reqOptions = {
            departure: props.scheduleOptions.origin.stationID,
            arrival: props.scheduleOptions.destination.stationID,
            date: props.scheduleOptions.time
        };
        let resultJson = null;

        try {
            if (props.railType === RAILTYPE_E.TRA) {
                resultJson = await getTRATrainByDate(reqOptions);
            }
            else if (props.railType === RAILTYPE_E.THSR) {
                resultJson = await getTHSRTrainByDate(reqOptions);
            }
        }
        catch (error) {
            resultJson = null;
            notifyError(error.toString());
        }

        props.handleSubmit(resultJson, props.scheduleOptions);
    }

    // Development mode only
    if (!__PRODUCTION__) {
    }
    // End of development mode code

    return (
        <Row>
            <Form.Group as={Col} xs="4">
                <Form.Label>&nbsp;</Form.Label>
                <Button
                    variant="light"
                    type="button"
                    size="lg"
                    className="fullWidth"
                    onClick={props.handleSwap}
                >
                    <BsArrowDownUp />
                </Button>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>&nbsp;</Form.Label>
                <Button
                    variant="dark"
                    type="button"
                    size="lg"
                    className="fullWidth"
                    onClick={requestTrains}
                >
                    <BsSearch />
                </Button>
            </Form.Group>
        </Row>
    );
}

export default memo(ActionButtons);