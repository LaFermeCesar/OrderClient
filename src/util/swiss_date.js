const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

class SwissDate {
    constructor(stringOrTime) {
        if (stringOrTime) {
            this._date = new Date(stringOrTime);
        } else {
            this._date = new Date();
        }
        // add one/two hours because of GMT+1/2 (in switzerland, 1 hour, at the time of the writing)
        this._date.setTime(this._date.getTime() + 2 * HOUR);
        // only the date matters
        this._date.setUTCHours(0, 0, 0, 0);
    }

    get day() {
        return this._date.getUTCDay();
    }

    get month() {
        return this._date.getUTCMonth();
    }

    get year() {
        return this._date.getUTCFullYear();
    }

    get string() {
        return this._date.toISOString();
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

    static next = (days) => SwissDate.now().next(days)

    static now = () => new SwissDate();
}

export default SwissDate