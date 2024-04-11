const timeFormat = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let dat = date.getDate();
    if (dat < 10) {
        dat = '0' + dat;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }

    return year + '-' + month + '-' + dat + 'T' + hour + ':' + minute;
}

const timeDifference = (time1, time2) => {
    return time1.getTime() - time2.getTime();
}

/*
** input:
**    string
**        i.g. "10:30"
** output:
**    integer array: [0] for hours, [1] for minutes
*/
function getTravelTime(departureTime, arrivalTime) {
    // Split into hour [0] and minute [1]
    let dTime = departureTime.split(':');
    let aTime = arrivalTime.split(':');

    // travel time in minutes
    let travelTimeMinute = (parseInt(aTime[0], 10) * 60) + parseInt(aTime[1], 10) - (parseInt(dTime[0], 10) * 60) -  parseInt(dTime[1], 10);
    let travelTime = [0, 0];


    // if arrival Time cross a day, travelTimeMinutes would be a negative value.
    // Add 24 hr on it.
    if (travelTimeMinute < 0)
    {
        travelTimeMinute += 24 * 60;
    }

    // Return an array with [0]: hour, [1]: minute
    travelTime[0] = Math.floor(travelTimeMinute / 60);
    travelTime[1] = travelTimeMinute - (travelTime[0] * 60);
    //console.log(travelTime)

    return travelTime;
}

export { timeFormat, timeDifference, getTravelTime };