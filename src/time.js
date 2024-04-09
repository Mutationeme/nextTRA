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

export { timeFormat, timeDifference };