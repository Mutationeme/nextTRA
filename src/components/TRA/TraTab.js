import React, { memo, useCallback, useState } from 'react';

// Language: zh_tw
import textLang from "../../helpers/languages/zh_tw.json";

import { Form, Container } from 'react-bootstrap';
import { timeDifference } from "../../helpers/time/index.js";
import { RAILTYPE_E } from '../../helpers/type/railType.js';

// Components
import TrainList from '../common/TrainList/TrainList.js';
import CountyStationSelect from './CountyStationSelect/CountyStationSelect.js';
import TimeSelect from '../common/TimeSelect/TimeSelect.js';
import ActionButtons from "../common/ActionButtons/ActionButtons.js";

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
        let newScheduleResult = {
            origin: {
                stationID: -1,
                stationName: ""
            },
            destination: {
                stationID: -1,
                stationName: ""
            },
            trains: []
        }

        if (result !== undefined &&
            result !== null &&
            result.length !== undefined &&
            result.length !== 0
        ) {
            newScheduleResult = {
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
        }

        setScheduleResult(newScheduleResult);
    }, []);

    // Development mode only
    if (!__PRODUCTION__) {
    }
    // End of development mode code

    return (
        <Container>
            <Form>
                <CountyStationSelect
                    label={textLang.From}
                    countyIdx={schedule.origin.countyIdx}
                    stationID={schedule.origin.stationID}
                    selectCounty={selectOriginCounty}
                    selectStation={selectOriginStation}
                />

                <CountyStationSelect
                    label={textLang.To}
                    countyIdx={schedule.destination.countyIdx}
                    stationID={schedule.destination.stationID}
                    selectCounty={selectDestinationCounty}
                    selectStation={selectDestinationStation}
                />

                <TimeSelect
                    time={schedule.time}
                    selectTime={selectTime}
                />

                <ActionButtons
                    railType={RAILTYPE_E.TRA}
                    originStationID={schedule.origin.stationID}
                    destinationStationID={schedule.destination.stationID}
                    time={schedule.time}
                    handleSwap={handleSwap}
                    handleSubmit={handleScheduleResult}
                />
            </Form>

            <TrainList
                railType={RAILTYPE_E.TRA}
                originStationName={scheduleResult.origin.stationName}
                destinationStationName={scheduleResult.destination.stationName}
                trains={scheduleResult.trains}
            />
        </Container>
    );
}

export default memo(TraTab);