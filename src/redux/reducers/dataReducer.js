import {LOADING_DATA, SET_BREADS, SET_FUTURE_ORDERS, SET_LOCATIONS, SET_PAST_ORDERS} from '../types';

const initialState = {
    futureOrders: [],
    pastOrders: [],
    idToBread: {},
    idToLoc: {},
    loading: 0,
};

const toOrders = (orders, idToBread, idToLoc) => {
    return orders.map(order => ({
        ...order,
        location: idToLoc[order.locationID],
        breadList: order.breadList.map(breadOrder => ({
            ...breadOrder,
            ...idToBread[breadOrder.breadID]
        })),
    }))
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: state.loading + 1,
            };
        case SET_FUTURE_ORDERS:
            return {
                ...state,
                futureOrders: toOrders(action.payload, state.idToBread, state.idToLoc),
                loading: Math.max(0, state.loading - 1),
            };
        case SET_PAST_ORDERS:
            return {
                ...state,
                pastOrders: toOrders(action.payload, state.idToBread, state.idToLoc),
                loading: Math.max(0, state.loading - 1),
            };
        case SET_BREADS:
            return {
                ...state,
                idToBread: action.payload,
                loading: Math.max(0, state.loading - 1),
            };
        case SET_LOCATIONS:
            return {
                ...state,
                idToLoc: action.payload,
                loading: Math.max(0, state.loading - 1),
            };
        default:
            return state;
    }
}

