import React, { useCallback, useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { timeDifference } from "../../time";

import TrainList from './TrainList/TrainList.js';
import Footer from "../common/Footer/Footer.js"
import CountyStationSelect from './CountyStationSelect/CountyStationSelect.js';
import TimeSelect from '../common/TimeSelect/TimeSelect.js';
import ActionButtons from "../common/ActionButtons/ActionButtons.js"

function TraTab() {
    const [schedule, setSchedule] = useState({
        origin: {
            countyIdx: -1,
            stationID: ""
        },
        destination: {
            countyIdx: -1,
            stationID: ""
        },
        time: new Date()
    });

    const [scheduleResult, setScheduleResult] = useState({
        origin: {
            stationID: -1,
            stationName: ""
        },
        destination: {
            stationID: -1,
            stationName: ""
        },
        trains: []
    });

    const selectOriginCounty = useCallback((index) => {
        setSchedule((prevState) => {
            return {
                origin: {
                    countyIdx: index,
                    stationID: ""
                },
                destination: prevState.destination,
                time: prevState.time
            };
        });
    }, []);

    const selectDestinationCounty = useCallback((index) => {
        setSchedule((prevState) => {
            return {
                origin: prevState.origin,
                destination: {
                    countyIdx: index,
                    stationID: ""
                },
                time: prevState.time
            }
        });
    }, []);

    const selectOriginStation = useCallback((id) => {
        setSchedule((prevState) => {
            return {
                origin: {
                    countyIdx: prevState.origin.countyIdx,
                    stationID: id
                },
                destination: prevState.destination,
                time: prevState.time
            };
        });
    }, []);

    const selectDestinationStation = useCallback((id) => {
        setSchedule((prevState) => {
            return {
                origin: prevState.origin,
                destination: {
                    countyIdx: prevState.destination.countyIdx,
                    stationID: id
                },
                time: prevState.time
            };
        });
    }, []);

    const selectTime = useCallback((time) => {
        setSchedule((prevState) => {
            return {
                origin: prevState.origin,
                destination: prevState.destination,
                time: time
            };
        });
    }, []);

    const handleSwap = useCallback(() => {
        setSchedule((prevState) => {
            return {
                origin: prevState.destination,
                destination: prevState.origin,
                time: prevState.time
            }
        });
    }, []);

    /*
    ** args:
    **  result: json 
    */
    const handleScheduleResult = useCallback((result, option) => {
        if (result.length === 0) {
            return;
        }

        let newScheduleResult = {
            origin: {
                stationID: result[0].OriginStopTime.StationID,
                stationName: result[0].OriginStopTime.StationName.Zh_tw
            },
            destination: {
                stationID: result[0].DestinationStopTime.StationID,
                stationName: result[0].DestinationStopTime.StationName.Zh_tw
            },
            trains: []
        };

        for (let i = 0; i < result.length; i++) {
            let trainTime = new Date(result[i].TrainDate + "T" + result[i].OriginStopTime.DepartureTime);
            if (timeDifference(trainTime, option.time) >= 0) {
                newScheduleResult.trains.push({
                    trainNo: result[i].DailyTrainInfo.TrainNo,
                    trainType: result[i].DailyTrainInfo.TrainTypeName.Zh_tw,
                    departureTime: result[i].OriginStopTime.DepartureTime,
                    arrivalTime: result[i].DestinationStopTime.ArrivalTime,
                    tripLine: result[i].DailyTrainInfo.TripLine
                })
            }
        }

        setScheduleResult(newScheduleResult);
    }, []);

    // Development mode only
    if (!__PRODUCTION__ && true) {
        React.useEffect(() => {
            console.log(schedule);
            //console.log(scheduleResult);
        }, [schedule/*, scheduleResult*/])
    }
    // End of development mode code

    return (
        <Container>
            <Form>
                <CountyStationSelect
                    label={"From"}
                    countyIdx={schedule.origin.countyIdx}
                    station={schedule.origin.stationID}
                    selectCounty={selectOriginCounty}
                    selectStation={selectOriginStation}
                />

                <CountyStationSelect
                    label={"To"}
                    countyIdx={schedule.destination.countyIdx}
                    station={schedule.destination.stationID}
                    selectCounty={selectDestinationCounty}
                    selectStation={selectDestinationStation}
                />

                <TimeSelect
                    time={schedule.time}
                    selectTime={selectTime}
                />

                <ActionButtons
                    scheduleOptions={schedule}
                    handleSwap={handleSwap}
                    handleSubmit={handleScheduleResult}
                />
            </Form>

            <TrainList
                scheduleResult={scheduleResult}
            />

            <Footer />
        </Container>
    );
}

export default TraTab;