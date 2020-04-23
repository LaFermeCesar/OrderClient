import {LOADING_DATA, SET_FUTURE_ORDERS, SET_PAST_ORDERS} from '../types';
import axios from 'axios';

export const getFutureOrders = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    axios.get('/future_orders')
        .then(res => dispatch({
                type: SET_FUTURE_ORDERS,
                payload: res.data,
            })
        )
        .catch(err => {
            console.log(err);
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
    axios.get('/past_orders')
        .then(res => dispatch({
                type: SET_PAST_ORDERS,
                payload: res.data,
            })
        )
        .catch(err => {
            console.log(err);
            if (err.status === 403) {
                window.location.reload(false);
            }
            dispatch({
                type: SET_PAST_ORDERS,
                payload: [],
            })
        })
};

