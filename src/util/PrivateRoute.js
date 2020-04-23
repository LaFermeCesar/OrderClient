import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const PrivateRoute = ({component: Component, authenticated, ...rest}) => (
    <Route
        {...rest}
        render={(props) =>
            authenticated ? <Component {...props}/> : <Redirect to='/login'/>
        }
    />
);

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
});

PrivateRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(PrivateRoute);