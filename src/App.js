import React, { useState, /*useEffect*/ } from 'react';
import { Form, Col, Container, Button, InputGroup } from 'react-bootstrap';

import { getTrainByDate } from './request/index.js';
import { timeFormat } from './time.js';
import counties from './stationInfo/counties.json';
import stations from './stationInfo/stations.json';

import List from './components/List/list.js';

function App() {
    const [departure, setDepart] = useState("");
    const [arrival, setArriv] = useState("");
    const [county, setCounty] = useState(["", ""]);
    const [stationList, setList] = useState([[], []]);
    const [time, setTime] = useState(new Date());
    const [result, setResult] = useState([]);

    function bsearch(target, start, end) {
        //Binary search
        if (start > end) {
            return -1;
        }

        let mid = Math.floor((start + end) / 2);
        let id = stations.Stations[mid].StationID;

        if (id === target) {
            return mid;
        }
        else if (parseInt(id, 10) < parseInt(target, 10)) {
            return bsearch(target, mid + 1, end);
        }
        else {
            return bsearch(target, start, mid - 1);
        }
    }



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
            if (!res.TrainTimetables) {
                return;
            }
            res.TrainTimetables.forEach((train) => {
                let trainTime = res.TrainDate + "T" + train.StopTimes[0].DepartureTime;
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
    const footerStyle = {
        position: "relative",
        left: "0",
        bottom: "0",
        width: "100%",
        textAlign: "cneter",
        color: "lightgray"
    };
    /*
    useEffect(() => {
        console.log("Dep: " + departure);
        console.log("Arr: " + arrival);
        console.log("Tim: " + time);
        console.log("res: "+result);
    }, [departure, arrival, time, result])
    */
    return (
        <Container>
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>From</Form.Label>
                        <Form.Control as="select"
                            onChange={(event) => {
                                if (event.target.value !== "") {
                                    setCounty([event.target.value, county[1]]);
                                    setList([counties[event.target.value].stations, stationList[1]]);
                                }
                                else {
                                    setCounty([null, county[1]]);
                                    setList([[], stationList[1]]);
                                }
                                setDepart("");
                            }}
                            value={county[0]}
                            required
                        >
                            <option value=""></option>
                            {
                                counties.map((data, i) => {
                                    return (
                                        <option key={data.County} value={i}>{data.County}</option>
                                    );
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control as="select"
                            onChange={(event) => {
                                setDepart(event.target.value);
                            }}
                            value={departure}
                            required
                        >
                            <option value=""></option>
                            {
                                stationList[0].map((data) => {
                                    let res = bsearch(data, 0, stations.Stations.length - 1);

                                    if (res > 0) {
                                        return (
                                            <option key={data} value={data}>{stations.Stations[res].StationName.Zh_tw}</option>
                                        );
                                    }
                                    else {
                                        return null;
                                    }
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>To</Form.Label>
                        <Form.Control as="select"
                            onChange={(event) => {
                                if (event.target.value !== "") {
                                    setList([stationList[0], counties[event.target.value].stations]);
                                    setCounty([county[0], event.target.value]);
                                }
                                else {
                                    setList([stationList[0], []]);
                                    setCounty([county[0], null]);
                                }
                                setArriv("");
                            }}
                            value={county[1]}
                            required
                        >
                            <option value=""></option>
                            {
                                counties.map((data, i) => {
                                    return (
                                        <option key={data.County} value={i}>{data.County}</option>
                                    );
                                })
                            }
                        </Form.Control>
                    </Form.Group>


                    <Form.Group as={Col}>
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control as="select"
                            onChange={(event) => {
                                setArriv(event.target.value);
                            }}
                            value={arrival}
                            required
                        >
                            <option value=""></option>
                            {
                                stationList[1].map((data) => {
                                    let res = bsearch(data, 0, stations.Stations.length - 1);

                                    if (res > 0) {
                                        return (
                                            <option key={data} value={data}>{stations.Stations[res].StationName.Zh_tw}</option>
                                        );
                                    }
                                    else {
                                        return null;
                                    }
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
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
                            <InputGroup.Append>
                                <Button type="button" variant="outline-secondary" onClick={() => { setTime(new Date()) }}>Now</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
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
                </Form.Row>
            </Form >

            <List trains={result} />

            <div id="footer" style={footerStyle}>
                資料來源: 交通部PTX平臺/2020/v3
            </div>
        </Container>
    );
}
export default App;