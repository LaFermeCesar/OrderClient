import Bread from "./bread";
import Location from "./location";

class Order {
    constructor(orderID, locationID, locationDate, breadList, createdAt, lastModified, idToLoc, idToBread) {
        this.orderID = orderID;
        this.location = new Location(locationID, idToLoc);
        this.locationDate = new Date(locationDate);
        this.breadList = breadList.map((breadOrder) => ({
            bread: new Bread(breadOrder.breadID, idToBread),
            quantity: breadOrder.quantity,
        }));
        this.createdAt = new Date(createdAt);
        this.lastModified = new Date(lastModified);
    }

    get json() {
        return {
            orderID: this.orderID,
            locationID: this.location.locationID,
            locationDate: this.locationDate,
            breadList: this.breadList.map((breadOrder) => ({
                breadID: breadOrder.bread.breadID,
                quantity: breadOrder.quantity,
            })),
            createdAt: this.createdAt,
            lastModified: this.lastModified,
        }
    }

    get totalQuantity() {
        return this.breadList.reduce((acc, breadOrder) => acc + breadOrder.quantity)
    }
}

export default Order;