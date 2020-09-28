import { timeFormat } from '../time.js';

const URL = "https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/";

const getStations = async () => {
    let reqOption = {
        method: "GET"
    };
    let URLi = URL + "Station?$format=JSON";

    try {
        let response = await fetch(URLi, reqOption);
        if (!response.ok) {
            throw Error(response.status);
        }
        else {
            return response.json();
        }
    }
    catch (err) {
        console.error("error: " + err);
    }
}

const getTrainByDate = async (info) => {
    /*
    info:{
        departure: "String",
        arrival: "String"
        date: "Date"
    }
    */
    let reqOption = {
        method: "GET"
    };
    let URLi = URL + "DailyTrainTimetable/OD/" + info.departure + "/to/" + info.arrival + "/" + timeFormat(info.date).split('T')[0] + "?$format=JSON";

    try {
        let response = await fetch(URLi, reqOption);
        return response.json();
    }
    catch (error) {
        console.error(error);
    }
}

export { getTrainByDate, getStations };