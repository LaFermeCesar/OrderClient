import {LOADING_DATA, LOADING_UI, SET_ERRORS, SET_FUTURE_ORDERS, SET_ORDER, SET_PAST_ORDERS} from '../types';
import http from '../../util/http'
import SwissDate from "../../util/swiss_date";

const setFutureOrders = (orders) => (dispatch) => {
    dispatch({
        type: SET_FUTURE_ORDERS,
        payload: orders,
    })
}

export const getFutureOrders = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    http.get('/future_orders')
        .then((res) => setFutureOrders(res.data)(dispatch))
        .catch(err => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
            setFutureOrders([])(dispatch)
        })
};


const setPastOrders = (orders) => (dispatch) => {
    dispatch({
        type: SET_PAST_ORDERS,
        payload: orders,
    })
}


export const getPastOrders = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    http.get('/past_orders')
        .then(res => setPastOrders(res.data)(dispatch))
        .catch(err => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
            setPastOrders([])(dispatch)
        })
};


export const setLoading = () => (dispatch) => dispatch({type: LOADING_UI})

export const setErrors = (errors) => (dispatch) => {
    dispatch({
        type: SET_ERRORS,
        payload: errors,
    })
}

export const newOrder = (history) => (dispatch) => {
    dispatch({
        type: SET_ORDER,
        payload: {},
    })
    history.push('/order')
}

export const editOrder = (order, history) => (dispatch) => {
    setErrors({})(dispatch)
    dispatch({
        type: SET_ORDER,
        payload: order,
    })
    history.push('/order')
}

export const repeatOrder = (order, history) => (dispatch) => {
    setErrors({})(dispatch)
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


export const cancelOrder = () => (dispatch) => {
    setErrors({})(dispatch)

}

export const updateSelectedOrder = (order) => (dispatch) => {
    dispatch({
        type: SET_ORDER,
        payload: order,
    })
}

export const postOrder = (order) => (dispatch) => {
    dispatch({type: LOADING_UI})
    http.post('/order', this.state.order)
        .then(() => {
            const dayDif = new SwissDate(this.state.order.locationDate).dayDifference(SwissDate.now())
            if (dayDif >= (2 + this.state.order.location.isMarket)) {
                this.setState({
                    orderInTime: true,
                });
            } else {
                this.setState({
                    orderInTime: false,
                });
            }
            this.setState({
                openAlert: true,
            });
            setErrors({})(dispatch)
        })
        .catch((err) => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
            setErrors(err.response.data)(dispatch);
        })
}

export const deleteOrder = (order, history) => (dispatch) => {
    dispatch({type: LOADING_UI})
    http.post('/delete_order', {orderID: this.state.order.orderID})
        .then(() => {
            this.props.history.push('/');
        })
        .catch((err) => {
            console.log(err.response);
            if (err.status === 403) {
                window.location.reload(false);
            }
        })
        .finally(() => {
            setErrors({})
        });
};