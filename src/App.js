import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container, Button, InputGroup } from 'react-bootstrap';

import { getTrainByDate } from './request/index.js';
import { timeFormat } from './time.js';
import stations from './stationInfo/stations.json';

import List from './components/List/list.js';
import Footer from "./components/Footer/footer.js"
import Select from './components/Select/select.js';

function App() {
    const [departure, setDepart] = useState("");
    const [arrival, setArriv] = useState("");
    const [county, setCounty] = useState(["", ""]);
    const [stationList, setList] = useState([[], []]);
    const [time, setTime] = useState(new Date());
    const [result, setResult] = useState([]);

    //
    const [schedule, setSchedule] = useState({
        origin: {
            countyIdx: -1,
            stationID: ""
        },
        destination: {
            countyIdx: -1,
            stationID: ""
        }
    });

    function selectOriginCounty(index) {
        setSchedule({
            origin: {
                countyIdx: index,
                stationID: ""
            },
            destination: schedule.destination
        });
    }

    function selectDestinationCounty(index) {
        setSchedule({
            origin: schedule.origin,
            destination: {
                countyIdx: index,
                stationID: ""
            }
        });
    }

    function selectOriginStation(id) {
        setSchedule({
            origin: {
                countyIdx: schedule.origin.countyIdx,
                stationID: id
            },
            destination: schedule.destination
        });
    }

    function selectDestinationStation(id) {
        setSchedule({
            origin: schedule.origin,
            destination: {
                countyIdx: schedule.destination.countyIdx,
                stationID: id
            }
        });
    }
    //

    function addDay(date, days) {
        //PTX API only provide date within 60 days
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function handleSubmit() {
        let arg = {
            departure: departure,
            arrival: arrival,
            date: time
        };
        let trains = [];
        getTrainByDate(arg).then((res) => {
            res.forEach((train) => {
                let trainTime = train.TrainDate + "T" + train.OriginStopTime.DepartureTime;
                let timeLag = (new Date(trainTime)).getTime() - time.getTime();

                if (timeLag >= 0) {
                    trains.push({
                        timeLag: timeLag,
                        ...train
                    });
                }
            })
            trains.sort((a, b) => {
                return a.timeLag - b.timeLag;
            })
            setResult(trains);
        })
    }
    
    useEffect(() => {
        console.log(schedule);
    }, [schedule])
    
    return (
        <Container>
            <Form>
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

                {/* <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Date</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="datetime-local"
                                value={timeFormat(time)}
                                min={timeFormat(new Date()).slice(0, 10) + "T00:00"}
                                max={timeFormat(addDay(new Date(), 60)).slice(0, 10) + "T23:59"}
                                onChange={(event) => {
                                    setTime(new Date(event.target.value));
                                }}
                            />
                            <Button type="button" variant="outline-secondary" onClick={() => { setTime(new Date()) }}>Now</Button>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs="4">
                        <Form.Label>&nbsp;</Form.Label>
                        <Button
                            variant="outline-info"
                            type="button"
                            size="lg"
                            style={{ width: "100%" }}
                            onClick={
                                () => {
                                    let temp = arrival;
                                    setArriv(departure);
                                    setDepart(temp);

                                    temp = county[0];
                                    setCounty([county[1], temp]);

                                    temp = stationList[0];
                                    setList([stationList[1], temp]);
                                }
                            }
                        >
                            互換
                        </Button>
                    </Form.Group>
                    <Form.Group as={Col} >
                        <Form.Label>&nbsp;</Form.Label>
                        <Button
                            variant="dark"
                            type="button"
                            size="lg"
                            style={{ width: "100%" }}
                            onClick={handleSubmit}
                        >
                            查詢
                        </Button>
                    </Form.Group>
                </Row> */}
            </Form>

            {/* <List trains={result} /> */}

            <Footer />
        </Container>
    );
}

export default App;