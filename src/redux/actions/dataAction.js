import {
    CLEAR_ERRORS,
    CLEAR_ORDER,
    HIDE_DELETE_CONFIRM,
    LOADING_DATA,
    LOADING_UI,
    ORDER_SUCCESS_IN_TIME,
    ORDER_SUCCESS_OUT_OF_TIME,
    SET_ERRORS,
    SET_FUTURE_ORDERS,
    SET_ORDER,
    SET_PAST_ORDERS
} from '../types';

import http from '../../util/http'
import SwissDate from "../../util/swiss_date";

export const getFutureOrders = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    http.get('/future_orders')
        .then((res) =>
            dispatch({
                type: SET_FUTURE_ORDERS,
                payload: res.data,
            }))
        .catch(err => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
            dispatch({
                type: SET_FUTURE_ORDERS,
                payload: [],
            })
        })
};


export const getPastOrders = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    http.get('/past_orders')
        .then(res => dispatch({
            type: SET_PAST_ORDERS,
            payload: res.data,
        }))
        .catch(err => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
            dispatch({
                type: SET_PAST_ORDERS,
                payload: [],
            })
        })
};


export const newOrder = (history) => (dispatch) => {
    dispatch({type: CLEAR_ERRORS,})
    dispatch({type: CLEAR_ORDER,})
    history.push('/order')
}

export const editOrder = (order, history) => (dispatch) => {
    dispatch({type: CLEAR_ERRORS,})
    dispatch({
        type: SET_ORDER,
        payload: order,
    })
    history.push('/order')
}

export const repeatOrder = (order, history) => (dispatch) => {
    dispatch({type: CLEAR_ERRORS,})
    const newOrder = {
        ...order,
    }
    delete newOrder.orderID;
    delete newOrder.locationDate;
    dispatch({
        type: SET_ORDER,
        payload: newOrder,
    })
    history.push('/order')
}


export const cancelOrder = (history) => (dispatch) => {
    dispatch({type: CLEAR_ERRORS,})
    dispatch({type: CLEAR_ORDER,})
    history.push('/');
}

export const updateSelectedOrder = (order) => (dispatch) => {
    dispatch({
        type: SET_ORDER,
        payload: order,
    })
}

export const postOrder = (order) => (dispatch) => {
    dispatch({type: LOADING_UI})
    http.post('/order', order)
        .then(() => {
            const dayDif = new SwissDate(order.locationDate).dayDifference(SwissDate.now())
            if (dayDif >= (2 + order.location.isMarket)) {
                dispatch({type: ORDER_SUCCESS_IN_TIME,})
            } else {
                dispatch({type: ORDER_SUCCESS_OUT_OF_TIME,})
            }
            dispatch({type: CLEAR_ERRORS,})
            dispatch({type: CLEAR_ORDER})
        })
        .catch((err) => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            })
        })
}

export const deleteOrder = (orderID, history) => (dispatch) => {
    dispatch({type: LOADING_UI})
    http.post('/delete_order', {orderID})
        .then(() => {
            history.push('/');
            window.location.reload(false);
        })
        .catch((err) => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
        })
        .finally(() => {
            dispatch({type: CLEAR_ERRORS,})
            dispatch({type: HIDE_DELETE_CONFIRM})
        });
};