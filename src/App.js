import React from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import './App.css';
import jwtDecode from 'jwt-decode'
// Theme style
import themeFile from './util/theme'
//Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./router/PrivateRoute";
import AdminRoute from "./router/AdminRoute";
import OnlyPublicRoute from "./router/OnlyPublicRoute";
// Pages
import home from './pages/my_orders'
import login from './pages/login'
import order from './pages/make_order'
import admin from './pages/admin'
// MUI
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
// MUI Pickers
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
// REDUX
import {Provider} from 'react-redux'
import store from './redux/store'
import {SET_AUTHENTICATED, SET_BREADS, SET_LOCATIONS, SET_USER} from './redux/types'
import {logoutUser} from "./redux/actions/userAction";
import DayjsUtils from '@date-io/dayjs';
import frCH from 'dayjs/locale/fr-ch';
import http from "./util/http";


const token = localStorage.FBToken;
let isAuthenticated = !!token

if (token) {
    const decodedToken = jwtDecode(token);
    isAuthenticated = decodedToken.exp * 1000 > Date.now() &&
        localStorage.locations && localStorage.breads && localStorage.userDetails;
    if (isAuthenticated) {
        http.setToken(token);
        store.dispatch({type: SET_AUTHENTICATED});

        store.dispatch({
            type: SET_LOCATIONS,
            payload: JSON.parse(localStorage.locations)
        });

        store.dispatch({
            type: SET_BREADS,
            payload: JSON.parse(localStorage.breads)
        });

        store.dispatch({
            type: SET_USER,
            payload: JSON.parse(localStorage.userDetails)
        });
    } else {
        store.dispatch(logoutUser());
        window.location.href = '/login';
    }
}

function App() {
    return (
        <MuiThemeProvider theme={createMuiTheme(themeFile)}>
            <MuiPickersUtilsProvider utils={DayjsUtils} locale={frCH}>
                <Provider store={store}>
                    <div className="App">
                        <Router>
                            <Navbar/>
                            <div className='container'>
                                <Switch>
                                    <OnlyPublicRoute exact path="/login" component={login}/>
                                    <PrivateRoute exact path="/" component={home}/>
                                    <PrivateRoute exact path="/order" component={order}/>
                                    <AdminRoute exact path="/admin" component={admin}/>
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
