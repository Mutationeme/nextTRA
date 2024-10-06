import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";
import { getTravelTime } from "../../../helpers/time/index.js";
import { RAILTYPE_E } from "../../../helpers/type/railType.js";
import textLang from "../../../helpers/languages/zh_tw.json";
import "./TrainList.css";
import { ERRORTYPE_E } from "../../../helpers/type/errorType.js";

/*
** Convert the tripLine number to readable information.
*/
function tripLineToText(tripLine) {
    if (tripLine === 1) {
        return textLang.Mountain;
    }
    else if (tripLine === 2) {
        return textLang.Coast;
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
    const regExp = /([\u4E00-\u9FFF]+)|(\(([^\(\)]+)\))/g;
    const matches = [...trainTypeString.matchAll(regExp)];
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

function TrainList({
    railType = RAILTYPE_E.NO_RAIL,
    originStationName = "",
    destinationStationName = "",
    trains = []
} = {}) {
    const isOriginStationNameValid = ((typeof originStationName === "string") && (originStationName !== ""));
    const isDestinationStationNameValid = ((typeof destinationStationName === "string") && (destinationStationName !== ""));
    const isTrainsValid = (Array.isArray(trains) && (trains.length > 0));

    function showSingleTRATrain(train) {
        if (train === undefined ||
            train.trainNo === undefined ||
            train.departureTime === undefined ||
            train.arrivalTime === undefined ||
            (
                railType === RAILTYPE_E.TRA &&
                (train.trainType === undefined || train.tripLine === undefined)
            )
        ) {
            return;
        }

        let singleTrainType = "";
        let tripLineText = "";
        let railStyle = "railStyle";
        let travelTimeElement = travelTimeToElement(train.departureTime, train.arrivalTime);

        if (railType === RAILTYPE_E.TRA) {
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
                    <div className="textAlignCenter">{originStationName}</div>
                    <div className="textAlignCenter">{train.departureTime}</div>
                </ListGroup.Item>
                <ListGroup.Item className={`trainArrive ${railStyle}`}>
                    <div className="textAlignCenter">{destinationStationName}</div>
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

    /*
    ** Style the time in chinese as the format: XX時YY分.
    */
    function travelTimeToElement(departureTime, arrivalTime) {
        let travelTime = getTravelTime(departureTime, arrivalTime);

        return (
            <div>
                <div className="textAlignCenter">
                    {
                        travelTime[0].toString().padStart(2, "0") + textLang.Hour
                    }
                </div>
                <div className="textAlignCenter">
                    {
                        travelTime[1].toString().padStart(2, "0") + textLang.Minute
                    }
                </div>
            </div>
        );
    }

    function showScheduleResult() {
        if (isOriginStationNameValid && isDestinationStationNameValid && isTrainsValid) {
            return (trains.map(showSingleTRATrain));
        }
    }

    // Development mode
    if (!__PRODUCTION__) {
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