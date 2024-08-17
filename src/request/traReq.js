import { timeFormat } from '../helpers/time';

const URL = "https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/";


/*
** Command:
**     curl -X 'GET' \
**     'https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/Station?%24format=JSON' \
**      -H 'accept: application/json'
*/
const getStations = async () => {
    let reqOption = {
        method: "GET"
    };
    let URLi = URL + "Station?%24format=JSON";

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
        if(!__PRODUCTION__)
        {
            console.error("error: " + err);
        }
    }
}

/*
** Query the TDX by train innformations and get the train schedule of the target date.
** arguments:
**  info:
**      departure: "String",
**      arrival: "String",
**      date: "Date"
** command:
**  curl -X 'GET' \
**  'https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/OD/0900/to/0910/2024-02-11?%24format=JSON' \
**  -H 'accept: application/json'
*/
async function getTrainByDate(info) {

    let reqOption = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": window.navigator.userAgent
        }
    };
    let URLi = URL + "DailyTimetable/OD/" + info.departure + "/to/" + info.arrival + "/" + timeFormat(info.date).split('T')[0] + "?$format=JSON";

    try {
        let response = await fetch(URLi, reqOption);
        return response.json();
    }
    catch (error) {
        //console.error(error);
    }
}

export { getTrainByDate, getStations };