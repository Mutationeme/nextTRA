/*
** This node script query the stations from the TDX platform and arrange the station information into resultFilePath by the sequence of county list in countiesFilePath.
** This node script would be auto executed by the build command in the package.json.
** Default result path: src/stationInfo/stations.json
** Default counties file path: src/stationInfo/counties.json
*/
const https = require("https");
const fs = require("fs");
const path = require("path");

const resultFilePath = path.join(__dirname, "..", "src", "stationInfo", "stations.json");
const countiesFilePath = path.join(__dirname, "..", "src", "stationInfo", "counties.json");
const stationListUrl = "https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24format=JSON";


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

            if (res.statusCode != 200) {
                console.error("Query url:" + url + ", Status Code: " + res.statusCode.toString());
            }

            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                resolve(data);
            })
        });
        req.on("error", (error) => {
            reject(error);
        });

        req.end();
    })
}

async function main() {
    // first two traditional chinese character after digits (postal code) 
    const regex = /\d([\u4e00-\u9fff]{2})/;
    const result = [];

    try {
        let stationList = await query(stationListUrl);
        stationList = JSON.parse(stationList);
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
    }
    catch (error) {
        console.error("Error: ", error.message);
    }
}

main();