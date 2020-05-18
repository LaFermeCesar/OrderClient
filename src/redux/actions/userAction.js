import http from '../../util/http'

import {
    CLEAR_ERRORS,
    LOADING_UI,
    LOGOUT,
    SET_AUTHENTICATED,
    SET_BREADS,
    SET_ERRORS,
    SET_LOCATIONS,
    SET_USER
} from '../types'

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({type: LOADING_UI});

    let signingIn = false;

    http.post('/signup', userData)
        .catch(err => {
            console.log(err.response)
            if (err.response.data.phoneNumber === 'already in use') {
                signingIn = true;
                return http.post('/login', userData)
            }
            return Promise.reject(err);
        })
        .then((res) => {

            const locations = res.data.locations
            dispatch({
                type: SET_LOCATIONS,
                payload: locations,
            });
            localStorage.setItem('locations', JSON.stringify(locations));

            const breads = res.data.breads
            dispatch({
                type: SET_BREADS,
                payload: breads
            });
            localStorage.setItem('breads', JSON.stringify(breads));

            const userDetails = res.data.user
            dispatch({
                type: SET_USER,
                payload: userDetails
            });
            localStorage.setItem('userDetails', JSON.stringify(userDetails));

            const firebaseToken = res.data.token;
            localStorage.setItem('FBToken', firebaseToken);
            http.setToken(firebaseToken);

            dispatch({type: SET_AUTHENTICATED});
            dispatch({type: CLEAR_ERRORS});

            if (signingIn) {
                history.push('/')
            } else { // signup -> order directly
                history.push('/order')
            }
        })
        .catch(err => {
            if (err.response.data) {
                dispatch({
                    type: SET_ERRORS,
                    payload: err.response.data,
                })
            } else {
                console.log(err.response);
            }
        })
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBToken');
    http.removeToken();
    dispatch({type: LOGOUT})
};