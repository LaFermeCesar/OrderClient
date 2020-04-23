class Location {
    constructor(locationID, idToLoc) {
        const {name, daysOfWeek: dayOfWeek} = idToLoc[locationID];

        this.locationID = locationID;
        this.name = name;
        this.daysOfWeek = dayOfWeek;
    }
}

export default Location;
