import axios from 'axios';

const BASE_URL = `https://europe-west1-orders-lfc.cloudfunctions.net/api`;

let auth = '';

const http = axios.create({
    baseURL: BASE_URL,
    transformRequest: [function (data, headers) {
        headers['Authorization'] = auth
        return JSON.stringify(data);
    }],
    headers: {
        'Content-Type': 'application/json'
    }
});

http.setToken = (token) => {
    // axios.defaults.headers.common['Authorization'] = token;
    auth = token;
}

http.removeToken = () => {
    // delete axios.defaults.headers.common['Authorization'];
    auth = '';
}

export default http;
