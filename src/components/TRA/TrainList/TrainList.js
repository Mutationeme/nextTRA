import React, { memo } from "react";
import { ListGroup } from "react-bootstrap";
import { getTravelTime } from "../../../time";

import "./TrainList.css";

function TrainList(props) {
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

    function tripLineToText(tripLine) {
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

        console.log(matches);

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
                    case "商務專開列車":{
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

    function showSingleTrain(train) {
        if (train != undefined &&
            train.trainNo != undefined &&
            train.trainType != undefined &&
            train.departureTime != undefined &&
            train.arrivalTime != undefined &&
            train.tripLine != undefined &&

            props.scheduleResult != undefined &&
            props.scheduleResult.origin != undefined &&
            props.scheduleResult.origin.stationName != undefined &&
            props.scheduleResult.destination != undefined &&
            props.scheduleResult.destination.stationName != undefined
        ) {

            train.trainType = filterTrainType(train.trainType);
            return (
                <ListGroup horizontal key={train.trainNo} className="train">
                    <ListGroup.Item className="trainNo">
                        <div className="textAlignCenter">{train.trainType}</div>
                        <div className="textAlignCenter">{train.trainNo}</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="trainDepart">
                        <div className="textAlignCenter">{props.scheduleResult.origin.stationName}</div>
                        <div className="textAlignCenter">{train.departureTime}</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="trainArrive">
                        <div className="textAlignCenter">{props.scheduleResult.destination.stationName}</div>
                        <div className="textAlignCenter">{train.arrivalTime}</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="trainTripLine">
                        <div className="textAlignCenter">
                            {
                                tripLineToText(train.tripLine)
                            }
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="trainTravelTime">
                        {
                            travelTimeToElement(train.departureTime, train.arrivalTime)
                        }
                    </ListGroup.Item>
                </ListGroup>
            );

        }
        else {
            return;
        }
    }

    function showScheduleResult() {
        if (props.scheduleResult != undefined &&
            props.scheduleResult.trains != undefined &&
            Array.isArray(props.scheduleResult.trains) === true &&
            props.scheduleResult.trains.length > 0
        ) {
            return (props.scheduleResult.trains.map(showSingleTrain));
        }
    }

    // Development mode
    if (!__PRODUCTION__) {
        console.log(props);
    }
    // End of development mode code

    return (
        <div>
            {
                showScheduleResult()
            }
        </div>
    );
}

export default memo(TrainList);