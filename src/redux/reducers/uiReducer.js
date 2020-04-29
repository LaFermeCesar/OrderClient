import {
    ASK_DELETE_CONFIRM,
    CLEAR_ERRORS,
    HIDE_DELETE_CONFIRM,
    LOADING_UI,
    ORDER_SUCCESS_IN_TIME,
    ORDER_SUCCESS_OUT_OF_TIME,
    ORDER_SUCESS_DONE,
    SET_ERRORS
} from '../types'

const initialState = {
    loading: false,
    errors: {},

    showOrderSuccess: false,
    isOrderInTime: true,

    showDeleteConfirm: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: {},
            };
        case LOADING_UI:
            return {
                ...state,
                loading: true,
            };
        case ORDER_SUCCESS_IN_TIME:
            return {
                ...state,
                showOrderSuccess: true,
                isOrderInTime: true,
            };
        case ORDER_SUCCESS_OUT_OF_TIME:
            return {
                ...state,
                showOrderSuccess: true,
                isOrderInTime: false,
            };
        case ORDER_SUCESS_DONE:
            return {
                ...state,
                showOrderSuccess: false,
            };
        case ASK_DELETE_CONFIRM:
            return {
                ...state,
                showDeleteConfirm: true,
            };
        case HIDE_DELETE_CONFIRM:
            return {
                ...state,
                showDeleteConfirm: false,
            };
        default:
            return state;

    }
}