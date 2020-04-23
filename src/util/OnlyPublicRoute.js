import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const OnlyPublicRoute = ({component: Component, authenticated, ...rest}) => (
    <Route
        {...rest}
        render={(props) =>
            authenticated ? <Redirect to='/'/> : <Component {...props}/>
        }
    />
);

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
});

OnlyPublicRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(OnlyPublicRoute);