const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

class SwissDate {
    constructor(stringOrTime) {
        let date;

        if (stringOrTime) {
            date = new Date(stringOrTime);
        } else {
            date = new Date();
        }

        this._date = SwissDate.fixTzDay(date);
        this._date.setUTCHours(0, 0, 0, 0); // only the date matters
    }

    get day() {
        return this._date.getUTCDay();
    }

    get string() {
        return this._date.toISOString();
    }

    static next = (days) => SwissDate.now().next(days)

    static now = () => {
        return new SwissDate();
    }

    static fixTzDay = (date) => { // add two hours because of GMT+2 (in switzerland, at the time of the writing)
        date = new Date(date)
        date.setTime(date.getTime() + 2 * HOUR)
        return date;
    }

    dayDifference = (other) => Math.round((this._date.getTime() - other._date.getTime()) / DAY)

    plus = (day) => {
        return new SwissDate(new Date(this._date.getTime() + day * DAY))
    }

    next = (days) => {
        let date = this;
        while (!days.includes(date.day)) {
            date = new SwissDate(date._date.getTime() + DAY)
        }
        return date;
    }
}

export default SwissDate