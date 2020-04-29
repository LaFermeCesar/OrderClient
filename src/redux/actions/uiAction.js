import {ASK_DELETE_CONFIRM, HIDE_DELETE_CONFIRM, ORDER_SUCESS_DONE} from "../types";

export const orderSuccessDone = () => (dispatch) => {
    dispatch({type: ORDER_SUCESS_DONE})
}

export const askDeleteConfirm = (order) => (dispatch) => {
    dispatch({type: ASK_DELETE_CONFIRM, payload: order.orderID})
}

export const cancelDelete = () => (dispatch) => {
    dispatch({type: HIDE_DELETE_CONFIRM})
}