import {LOGOUT, SET_AUTHENTICATED, SET_USER} from '../types'

const initialState = {
    authenticated: false,
    details: {
        firstName: '',
        lastName: '',
        isAdmin: false,
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
            };
        case LOGOUT:
            return initialState;
        case SET_USER:
            return {
                ...state,
                authenticated: true,
                details: action.payload,
            };
        default:
            return state;

    }

}