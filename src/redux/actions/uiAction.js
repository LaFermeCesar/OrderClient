import {ASK_DELETE_CONFIRM, HIDE_DELETE_CONFIRM, ORDER_SUCESS_DONE} from "../types";

export const orderSuccessDone = () => (dispatch) => {
    dispatch({type: ORDER_SUCESS_DONE})
}

export const askDeleteConfirm = () => (dispatch) => {
    dispatch({type: ASK_DELETE_CONFIRM})
}

export const cancelDelete = () => (dispatch) => {
    dispatch({type: HIDE_DELETE_CONFIRM})
}