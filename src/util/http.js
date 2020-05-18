import axios from 'axios';

const BASE_URL = `https://europe-west1-orders-lfc.cloudfunctions.net/api`;

let authToken;

const addAuthHeader = (data, headers) => {
    if (authToken !== undefined) {
        headers['Authorization'] = `Bearer ${authToken}`
    }
    return data;
}

const http = axios.create({
    baseURL: BASE_URL,
    transformRequest: [addAuthHeader, ...axios.defaults.transformRequest],
});

http.setToken = (token) => {
    authToken = token;
}

http.removeToken = () => {
    authToken = undefined;
}

export default http;
