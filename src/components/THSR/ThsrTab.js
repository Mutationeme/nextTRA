import React, { useState, useCallback } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import { RAILTYPE_E } from "../../helpers/type/railType.js";
import { timeDifference } from "../../helpers/time/index.js";

// Components
import StationSelect from "./StationSelect/StationSelect.js";
import TimeSelect from "../common/TimeSelect/TimeSelect.js";
import ActionButtons from "../common/ActionButtons/ActionButtons.js";
import TrainList from "../common/TrainList/TrainList.js";

// Language
import textLang from "../../helpers/languages/zh_tw.json";

function ThsrTab() {
    const [schedule, setSchedule] = useState({
        origin: {
            stationID: ""
        },
        destination: {
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

    const selectOriginStation = useCallback((id) => {
        setSchedule((prevState) => {
            return {
                origin: {
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
        };

        if (Array.isArray(result) && result.length > 0) {
            newScheduleResult = {
                origin: {
                    stationName: result[0].OriginStopTime.StationName.Zh_tw
                },
                destination: {
                    stationName: result[0].DestinationStopTime.StationName.Zh_tw
                },
                trains: []
            };

            for (let i = 0; i < result.length; i++) {
                let trainTime = new Date(result[i].TrainDate + "T" + result[i].OriginStopTime.DepartureTime);
                if (timeDifference(trainTime, option.time) >= 0) {
                    newScheduleResult.trains.push({
                        trainNo: result[i].DailyTrainInfo.TrainNo,
                        departureTime: result[i].OriginStopTime.DepartureTime,
                        arrivalTime: result[i].DestinationStopTime.ArrivalTime,
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
                <StationSelect
                    label={textLang.From}
                    stationID={schedule.origin.stationID}
                    selectStation={selectOriginStation}
                />

                <StationSelect
                    label={textLang.To}
                    stationID={schedule.destination.stationID}
                    selectStation={selectDestinationStation}
                />

                <TimeSelect
                    time={schedule.time}
                    selectTime={selectTime}
                />

                <ActionButtons
                    railType={RAILTYPE_E.THSR}
                    originStationID={schedule.origin.stationID}
                    destinationStationID={schedule.destination.stationID}
                    time={schedule.time}
                    handleSwap={handleSwap}
                    handleSubmit={handleScheduleResult}
                />
            </Form>

            <TrainList
                railType={RAILTYPE_E.THSR}
                originStationName={scheduleResult.origin.stationName}
                destinationStationName={scheduleResult.destination.stationName}
                trains={scheduleResult.trains}
            />
        </Container>
    );
}

export default ThsrTab;