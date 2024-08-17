import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";
import { getTravelTime } from "../../../helpers/time/index.js";
import { RAILTYPE_E } from "../../../helpers/type/railType.js";

import "./TrainList.css";

/*
** Style the time in chinese as the format: XX時YY分.
*/
function travelTimeToElement(departureTime, arrivalTime) {
    let travelTime = getTravelTime(departureTime, arrivalTime);

    return (
        <div>
            <div className="textAlignCenter">
                {
                    travelTime[0].toString().padStart(2, "0") + "時"
                }
            </div>
            <div className="textAlignCenter">
                {
                    travelTime[1].toString().padStart(2, "0") + "分"
                }
            </div>
        </div>
    );
}

/*
** Convert the tripLine number to readable information.
*/
function tripLineToText(tripLine) {
    //console(tripLine);
    if (tripLine === 1) {
        return "山";
    }
    else if (tripLine === 2) {
        return "海";
    }
    else {
        return " ";
    }
}

/*
** trainTypeString format:
**    e.g. 自強(3000)(EMU3000 型電車)
*/
function filterTrainType(trainTypeString) {
    let regExp = /([\u4E00-\u9FFF]+)|(\(([^\(\)]+)\))/g;
    let matches = [...trainTypeString.matchAll(regExp)];
    let type = "";

    /*
    ** e.g. 自強(3000)(EMU3000 型電車)
    ** match: [
    **  ["自強", "自強", undefined, undefined],
    **  ["(3000)", undefined, "(3000)", "3000"],
    **  ["(EMU3000 型電車)", undefined, "(EMU3000 型電車)", "EMU3000 型電車"]
    ** ]
    */

    if (
        matches.length > 0 &&
        matches[0].length > 0 &&
        matches[0][0] != undefined
    ) {
        type = matches[0][0];
    }
    else {
        return trainTypeString;
    }

    for (let i = 1; i < matches.length; i++) {
        if (
            matches[i][2] != undefined &&
            matches[i][3] != undefined
        ) {
            switch (matches[i][3]) {
                case "3000":
                case "專開列車":
                case "郵輪式列車":
                case "商務專開列車": {
                    type = type + matches[i][2];
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    return type;
}

/*
** props:
**    scheduleResult: object
**    railType: RAILTYPE_E
*/
function TrainList(props) {
    function showSingleTRATrain(train) {
        if (train === undefined ||
            train.trainNo === undefined ||
            train.departureTime === undefined ||
            train.arrivalTime === undefined || (
                props.railType === RAILTYPE_E.TRA &&
                (train.trainType === undefined || train.tripLine === undefined)
            )
        ) {
            return;
        }

        let singleTrainType = "";
        let tripLineText = "";
        let railStyle = "railStyle";
        let travelTimeElement = travelTimeToElement(train.departureTime, train.arrivalTime);

        if (props.railType === RAILTYPE_E.TRA) {
            singleTrainType = filterTrainType(train.trainType);
            tripLineText = tripLineToText(train.tripLine);
        }

        return (
            <ListGroup horizontal key={train.trainNo} className="train">
                <ListGroup.Item className={`trainNo ${railStyle}`}>
                    <div className="textAlignCenter">{singleTrainType}</div>
                    <div className="textAlignCenter">{train.trainNo}</div>
                </ListGroup.Item>
                <ListGroup.Item className={`trainDepart ${railStyle}`}>
                    <div className="textAlignCenter">{props.scheduleResult.origin.stationName}</div>
                    <div className="textAlignCenter">{train.departureTime}</div>
                </ListGroup.Item>
                <ListGroup.Item className={`trainArrive ${railStyle}`}>
                    <div className="textAlignCenter">{props.scheduleResult.destination.stationName}</div>
                    <div className="textAlignCenter">{train.arrivalTime}</div>
                </ListGroup.Item>
                <ListGroup.Item className={`trainTripLine ${railStyle}`}>
                    <div className="textAlignCenter">{tripLineText}</div>
                </ListGroup.Item>
                <ListGroup.Item className={`trainTravelTime ${railStyle}`}>
                    {travelTimeElement}
                </ListGroup.Item>
            </ListGroup>
        );
    }

    function showScheduleResult() {
        if (props === undefined ||
            props.scheduleResult === undefined ||

            props.scheduleResult.trains === undefined ||
            Array.isArray(props.scheduleResult.trains) === false ||
            props.scheduleResult.trains.length <= 0 ||

            props.scheduleResult.origin === undefined ||
            props.scheduleResult.origin.stationName === undefined ||

            props.scheduleResult.destination === undefined ||
            props.scheduleResult.destination.stationName === undefined
        ) {
            return;
        }

        return (props.scheduleResult.trains.map(showSingleTRATrain));
    }

    // Development mode
    if (!__PRODUCTION__) {
        console.log(props);
    }
    // End of development mode code

    return (
        <div className="trainList">
            {
                showScheduleResult()
            }
        </div>
    );
}

export default memo(TrainList);