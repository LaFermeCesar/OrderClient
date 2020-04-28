import {LOADING_DATA, SET_FUTURE_ORDERS, SET_PAST_ORDERS} from '../types';
import http from '../../util/http'

export const getFutureOrders = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    http.get('/future_orders')
        .then((res) => {
                dispatch({
                    type: SET_FUTURE_ORDERS,
                    payload: res.data,
                })
            }
        )
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
            })
        )
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

