import React from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import './App.css';
import jwtDecode from 'jwt-decode'
// Theme style
import themeFile from './util/theme'
//Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./util/PrivateRoute";
import OnlyPublicRoute from "./util/OnlyPublicRoute";
import axios from 'axios'
// Pages
import home from './pages/my_orders'
import login from './pages/login'
import order from './pages/make_order'
// MUI
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
// MUI Pickers
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
// REDUX
import {Provider} from 'react-redux'
import store from './redux/store'
import {SET_AUTHENTICATED, SET_BREADS, SET_LOCATIONS} from './redux/types'
import {logoutUser} from "./redux/actions/userAction";
import DayjsUtils from '@date-io/dayjs';

axios.defaults.baseURL = 'https://europe-west1-orders-lfc.cloudfunctions.net/api';

const theme = createMuiTheme(themeFile);

const token = localStorage.FBToken;

if (token) {
    const decodedToken = jwtDecode(token);
    const isAuthenticated = decodedToken.exp * 1000 > Date.now();
    if (isAuthenticated) {
        store.dispatch({type: SET_AUTHENTICATED});
        store.dispatch({
            type: SET_LOCATIONS,
            payload: JSON.parse(localStorage.idToLoc)
        });
        store.dispatch({
            type: SET_BREADS,
            payload: JSON.parse(localStorage.idToBread)
        });
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        store.dispatch(logoutUser());
        window.location.href = '/login';
    }
}

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DayjsUtils}>
                <Provider store={store}>
                    <div className="App">
                        <Router>
                            <Navbar/>
                            <div className="container">
                                <Switch>
                                    <OnlyPublicRoute exact path="/login" component={login}/>
                                    <PrivateRoute exact path="/" component={home}/>
                                    <PrivateRoute exact path="/order" component={order}/>
                                </Switch>
                            </div>
                        </Router>
                    </div>
                </Provider>
            </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    );
}

export default App;
