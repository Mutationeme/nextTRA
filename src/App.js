import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container, Button, InputGroup } from 'react-bootstrap';

import { getTrainByDate } from './request/index.js';
import { timeFormat, timeDifference } from './time.js';
import stations from './stationInfo/stations.json';

import List from './components/List/list.js';
import Footer from "./components/Footer/footer.js"
import Select from './components/Select/select.js';
import TimeSelect from './components/TimeSelect/TimeSelect.js';
import Buttons from "./components/Buttons/Buttons.js"

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
            if(timeDifference(trainTime, option.time) >= 0)
            {
                newScheduleResult.trains.push({
                    trainNo: result[i].DailyTrainInfo.TrainNo,
                    trainType: result[i].DailyTrainInfo.TrainTypeName.Zh_tw,
                    DepartureTime: result[i].OriginStopTime.DepartureTime,
                    ArrivalTime: result[i].DestinationStopTime.ArrivalTime,
                    TripLine: result[i].DailyTrainInfo.TripLine
                })
            }
        }

        setScheduleResult(newScheduleResult);
    }
    //

    // function handleSubmit() {
    //     let arg = {
    //         departure: departure,
    //         arrival: arrival,
    //         date: time
    //     };
    //     let trains = [];
    //     getTrainByDate(arg).then((res) => {
    //         res.forEach((train) => {
    //             let trainTime = train.TrainDate + "T" + train.OriginStopTime.DepartureTime;
    //             let timeLag = (new Date(trainTime)).getTime() - time.getTime();

    //             if (timeLag >= 0) {
    //                 trains.push({
    //                     timeLag: timeLag,
    //                     ...train
    //                 });
    //             }
    //         })
    //         trains.sort((a, b) => {
    //             return a.timeLag - b.timeLag;
    //         })
    //         setResult(trains);
    //     })
    // }

    useEffect(() => {
        console.log(schedule);
        console.log(scheduleResult);
    }, [schedule, scheduleResult])

    return (
        <Container>
            <Form>
                {/* CountyStationSelect */}
                <Select
                    label={"From"}
                    countyIdx={schedule.origin.countyIdx}
                    station={schedule.origin.stationID}
                    selectCounty={selectOriginCounty}
                    selectStation={selectOriginStation}
                />

                <Select
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

                {/* ActionButtons */}
                <Buttons
                    scheduleOptions={schedule}
                    handleSwap={handleSwap}
                    handleSubmit={handleScheduleResult}
                />
            </Form>

            {/* TrainList */}
            {/* <List trains={result} /> */}

            <Footer />
        </Container>
    );
}

export default App;