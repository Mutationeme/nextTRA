import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { timeDifference } from "./time";

import TrainList from './components/TrainList/TrainList.js';
import Footer from "./components/Footer/Footer.js"
import CountyStationSelect from './components/CountyStationSelect/CountyStationSelect.js';
import TimeSelect from './components/TimeSelect/TimeSelect.js';
import ActionButtons from "./components/ActionButtons/ActionButtons.js"

// Include the bootstrap in html head to reduce the build size
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
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

    function selectOriginCounty(index) {
        setSchedule({
            origin: {
                countyIdx: index,
                stationID: ""
            },
            destination: schedule.destination,
            time: schedule.time
        });
    }

    function selectDestinationCounty(index) {
        setSchedule({
            origin: schedule.origin,
            destination: {
                countyIdx: index,
                stationID: ""
            },
            time: schedule.time
        });
    }

    function selectOriginStation(id) {
        setSchedule({
            origin: {
                countyIdx: schedule.origin.countyIdx,
                stationID: id
            },
            destination: schedule.destination,
            time: schedule.time
        });
    }

    function selectDestinationStation(id) {
        setSchedule({
            origin: schedule.origin,
            destination: {
                countyIdx: schedule.destination.countyIdx,
                stationID: id
            },
            time: schedule.time
        });
    }

    function selectTime(time) {
        setSchedule({
            origin: schedule.origin,
            destination: schedule.destination,
            time: time
        });
    }

    function handleSwap() {
        let origin = schedule.origin
        let destination = schedule.destination;
        let time = schedule.time;
        setSchedule({
            origin: destination,
            destination: origin,
            time: time
        });
    }

    /*
    ** args:
    **  result: json 
    */
    function handleScheduleResult(result, option) {
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
    }

    // Development mode only
    if (!__PRODUCTION__ && false) {
        React.useEffect(() => {
            console.log(schedule);
            console.log(scheduleResult);
        }, [schedule, scheduleResult])
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

export default App;