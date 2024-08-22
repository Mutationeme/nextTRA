/*
** This node script query the stations from the TDX platform and arrange the station information into resultFilePath by the sequence of county list in countiesFilePath.
** This node script would be auto executed by the build command in the package.json.
** TRA:
**   Default result path: src/helpers/stationInfo/TRA/stations.json
**   Default counties file path: src/helpers/stationInfo/THSR/counties.json
** THSR:
**   Default result path: src/helpers/stationInfo/THSR/stations.json
*/
const https = require("https");
const fs = require("fs");
const path = require("path");

// TRA
const resultFilePath = path.join(__dirname, "..", "src", "helpers", "stationInfo", "TRA", "stations.json");
const countiesFilePath = path.join(__dirname, "..", "src", "helpers", "stationInfo", "TRA", "counties.json");
const stationListUrl = "https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24format=JSON";

// THSR
const thsrResultFilePath = path.join(__dirname, "..", "src", "helpers", "stationInfo", "THSR", "stations.json");
const thsrStationListUrl = "https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station?%24format=JSON";

/* Example:
** curl 'https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Network?%24top=30&%24format=JSON' \
** -X 'GET' \
** -H 'Accept: application/json' \
** -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
*/
function query(url) {
    return new Promise((resolve) => {
        let parsedUrl = new URL(url);
        let options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search, // "/path"
            port: 443,
            method: "GET",
            headers: {
                "Accept": "application/json",
                // Chrome
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
            }
        };

        let req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                if (res.statusCode == 200) {
                    try {
                        let dataJson = JSON.parse(data);
                        resolve(dataJson);
                    }
                    catch (error) {
                        reject(new Error("Error parsing JSON: " + error.message));
                    }
                }
                else {
                    reject(new Error("HTTP error! status:" + res.statusCode));
                }
            });
        });
        req.on("error", (error) => {
            reject(new Error('Request error: ' + error.message));
        });

        req.end();
    })
}

async function queryTRA() {
    // Query TRA StationInfo
    // first two traditional chinese character after digits (postal code) 
    const regex = /\d([\u4e00-\u9fff]{2})/;
    let result = [];

    try {
        let stationList = await query(stationListUrl);
        let countyList = JSON.parse(fs.readFileSync(countiesFilePath, "utf-8"));

        for (let i = 0; i < countyList.length; i++) {
            result.push({
                county: countyList[i],
                stations: []
            });
        }

        for (let i = 0; i < stationList.Stations.length; i++) {
            let station = stationList.Stations[i];
            let stationCounty = station.StationAddress.match(regex)[1];

            for (let j = 0; j < result.length; j++) {
                if (result[j].county == stationCounty) {
                    result[j].stations.push({
                        "StationUID": station.StationUID,
                        "StationID": station.StationID,
                        "StationName": station.StationName
                    });
                    break;
                }
            }
        }

        //sort StationID ascending
        for (let i = 0; i < result.length; i++) {
            result[i].stations.sort((station1, station2) => {
                if (parseInt(station1.StationID) > parseInt(station2.StationID)) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
        }

        //output result to file
        //console.log(result);
        fs.writeFileSync(resultFilePath, JSON.stringify(result));
        console.log("Update TRA stations information.");
    }
    catch (error) {
        console.error("Error: ", error.message);
    }
}

async function queryTHSR() {
    // Query THSR StationInfo
    let result = [];
    try {
        let thsrStationList = await query(thsrStationListUrl);

        for (let i = 0; i < thsrStationList.length; i++) {
            let station = thsrStationList[i];

            result.push({
                "StationUID": station.StationUID,
                "StationID": station.StationID,
                "StationName": station.StationName
            });
        }

        //output result to file
        //console.log(result);
        fs.writeFileSync(thsrResultFilePath, JSON.stringify(result));
        console.log("Update THSR stations information.");
    }
    catch (error) {
        console.error("Error: " + error);
    }
}


(function main() {
    queryTRA();
    queryTHSR();
})()