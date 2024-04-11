import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { getTravelTime } from '../../time.js'

import './list.css';

function List(props) {
    function travelTimeToElement(departureTime, arrivalTime) {
        console.log(departureTime);
        let travelTime = getTravelTime(departureTime, arrivalTime);

        return (
            <div>
                <div className='textAlignCenter'>
                    {
                        travelTime[0].toString().padStart(2, '0') + "時"
                    }
                </div>
                <div className='textAlignCenter'>
                    {
                        travelTime[1].toString().padStart(2, '0') + "分"
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
    //console.log(props.trains.trains);

    return (
        <div>
            {
                props.trains.trains.map((train) => {
                    //console.log(train);
                    return (
                        <ListGroup horizontal className='train'>
                            <ListGroup.Item className='trainNo'>
                                <div className='textAlignCenter'>{train.trainType}</div>
                                <div className='textAlignCenter'>{train.trainNo}</div>
                            </ListGroup.Item>
                            <ListGroup.Item className='trainDepart'>
                                <div className='textAlignCenter'>{props.trains.origin.stationName}</div>
                                <div className='textAlignCenter'>{train.departureTime}</div>
                            </ListGroup.Item>
                            <ListGroup.Item className='trainArrive'>
                                <div className='textAlignCenter'>{props.trains.destination.stationName}</div>
                                <div className='textAlignCenter'>{train.arrivalTime}</div>
                            </ListGroup.Item>
                            <ListGroup.Item className='trainTripLine'>
                                <div className='textAlignCenter'>
                                    {
                                        tripLineToText(train.tripLine)
                                    }
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item className='trainTravelTime'>
                                {
                                    travelTimeToElement(train.departureTime, train.arrivalTime)
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