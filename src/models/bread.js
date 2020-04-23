class Bread {
    constructor(breadID, idToBread) {
        const {name, desc, unitName, unitStep} = idToBread[breadID];

        this.breadID = breadID;
        this.name = name;
        this.desc = desc;
        this.unitName = unitName;
        this.unitStep = unitStep;
    }
}

export default Bread;
