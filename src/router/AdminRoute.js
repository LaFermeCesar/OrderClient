import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const AdminRoute = ({component: Component, isAdmin, ...rest}) => (
    <Route
        {...rest}
        render={(props) =>
            isAdmin ? <Component {...props}/> : <Redirect to='/'/>
        }
    />
);

const mapStateToProps = (state) => ({
    isAdmin: state.user.details.isAdmin,
});

AdminRoute.propTypes = {
    isAdmin: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(AdminRoute);