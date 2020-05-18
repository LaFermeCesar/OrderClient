import {
    ASK_DELETE_CONFIRM,
    CLEAR_ERRORS,
    HIDE_DELETE_CONFIRM,
    LOADING_UI,
    LOGOUT,
    ORDER_SUCCESS_DONE,
    ORDER_SUCCESS_IN_TIME,
    ORDER_SUCCESS_OUT_OF_TIME,
    SET_ERRORS
} from '../types'

const initialState = {
    loading: false,
    errors: {},

    showOrderSuccess: false,
    isOrderInTime: true,

    showDeleteConfirm: false,
    orderIDToDelete: '',
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case LOADING_UI:
            return {
                ...state,
                loading: true,
            };
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
        case ORDER_SUCCESS_DONE:
            return {
                ...state,
                showOrderSuccess: false,
            };
        case ASK_DELETE_CONFIRM:
            return {
                ...state,
                showDeleteConfirm: true,
                orderIDToDelete: action.payload,
            };
        case HIDE_DELETE_CONFIRM:
            return {
                ...state,
                showDeleteConfirm: false,
                orderIDToDelete: '',
            };
        default:
            return state;

    }
}