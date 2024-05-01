import React from "react";
import { ListGroup } from "react-bootstrap";
import { getTravelTime } from "../../time";

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
        React.useEffect(() => {
            console.log(props);
        }, [props]);
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

export default TrainList;