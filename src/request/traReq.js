import { timeFormat } from "../helpers/time";
import { ERRORTYPE_E } from "../helpers/type/errorType";

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
            if (!__PRODUCTION__) {
                console.error("HTTP error! Status:" + response.status);
            }

            throw Error(ERRORTYPE_E.FETCH_ERROR);
        }
        else {
            return response.json();
        }
    }
    catch (error) {
        if (!__PRODUCTION__) {
            console.error("error: " + error);
        }

        throw Error(ERRORTYPE_E.FETCH_ERROR);
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

        if (!response.ok) {
            // HTTP-level errors. Fetch succeeds and server responds with an error status.
            if (!__PRODUCTION__) {
                console.error("HTTP error! Status:" + response.status);
            }

            throw new Error(ERRORTYPE_E.FETCH_ERROR);
        }

        return await response.json();
    }
    catch (error) {
        // Network or JavaScript runtime errors. Request fails entirely.
        if (!__PRODUCTION__) {
            console.error(error);
        }

        throw new Error(ERRORTYPE_E.FETCH_ERROR);
    }
}

export { getTrainByDate, getStations };