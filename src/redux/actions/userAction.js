import http from '../../util/http'

import {
    CLEAR_ERRORS,
    LOADING_UI,
    SET_AUTHENTICATED,
    SET_BREADS,
    SET_ERRORS,
    SET_LOCATIONS,
    SET_UNAUTHENTICATED,
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
            const idToLoc = {};
            res.data.locations.forEach((loc) => idToLoc[loc.locationID] = loc);
            dispatch({
                type: SET_LOCATIONS,
                payload: idToLoc,
            });
            localStorage.setItem('idToLoc', JSON.stringify(idToLoc));

            const idToBread = {};
            res.data.breads.forEach((bread) => idToBread[bread.breadID] = bread);
            dispatch({
                type: SET_BREADS,
                payload: idToBread
            });
            localStorage.setItem('idToBread', JSON.stringify(idToBread));

            const userDetails = res.data.user
            dispatch({
                type: SET_USER,
                payload: userDetails
            });
            localStorage.setItem('userDetails', JSON.stringify(userDetails));

            const firebaseToken = `Bearer ${res.data.token}`;
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
    dispatch({type: SET_UNAUTHENTICATED})
};