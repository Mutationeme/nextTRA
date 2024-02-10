import React from 'react';
import { ListGroup } from 'react-bootstrap';

function List(props) {
    function travelTime(train) {
        let departureTime = train.OriginStopTime.DepartureTime.split(':');
        let arrivalTime = train.DestinationStopTime.ArrivalTime.split(':');

        let timeLag = parseInt(arrivalTime[0], 10) * 60 + parseInt(arrivalTime[1], 10) - parseInt(departureTime[0], 10) * 60 - parseInt(departureTime[1], 10);

        if (timeLag < 0) {
            timeLag += 24 * 60;
        }
        return (
            <div>
                <div style={textAlignCenter}>
                    {
                        (parseInt(timeLag / 60) < 10 ? ("0" + parseInt(timeLag / 60)) : parseInt(timeLag / 60)) + "時"
                    }
                </div>
                <div style={textAlignCenter}>
                    {timeLag % 60 + "分"}
                </div>
            </div>
        );
    }

    const textAlignCenter = {
        textAlign: "center"
    }

    return (
        <div>
            {
                props.trains.map((train) => {
                    return (
                        <ListGroup horizontal key={train.DailyTrainInfo.TrainNo} style={{ margin: "1vh 0" }}>
                            <ListGroup.Item style={{ padding: "0.5rem", width: "25%", backgroundColor:"#f2f2f2" }}>
                                <div style={textAlignCenter}>{train.DailyTrainInfo.TrainTypeName.Zh_tw}</div>
                                <div style={textAlignCenter}>{train.DailyTrainInfo.TrainNo}</div>
                            </ListGroup.Item>
                            <ListGroup.Item style={{ padding: "0.5rem", width: "20%", backgroundColor:"#f2f2f2" }}>
                                <div style={textAlignCenter}>{train.OriginStopTime.StationName.Zh_tw}</div>
                                <div style={textAlignCenter}>{train.OriginStopTime.DepartureTime}</div>
                            </ListGroup.Item>
                            <ListGroup.Item style={{ padding: "0.5rem", width: "20%", backgroundColor:"#f2f2f2" }}>
                                <div style={textAlignCenter}>{train.DestinationStopTime.StationName.Zh_tw}</div>
                                <div style={textAlignCenter}>{train.DestinationStopTime.ArrivalTime}</div>
                            </ListGroup.Item>
                            <ListGroup.Item style={{ padding: "0.5rem", width: "10%", backgroundColor:"#f2f2f2" }}>
                                <div style={textAlignCenter}>
                                    {
                                        (() => {
                                            let line = train.DailyTrainInfo.TripLine;
                                            if (line === 1) {
                                                return "山";
                                            }
                                            else if (line === 2) {
                                                return "海"
                                            }
                                            else {
                                                return " ";
                                            }
                                        })()
                                    }
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item style={{ padding: "0.5rem", width: "25%", backgroundColor:"#f2f2f2" }}>
                                {
                                    travelTime(train)
                                }
                            </ListGroup.Item>
                        </ListGroup>
                    );
                })
            }
        </div>
    );
}

export default List;