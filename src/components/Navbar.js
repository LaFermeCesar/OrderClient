import React, {Component} from 'react';

import {connect} from 'react-redux';
import {logoutUser} from "../redux/actions/userAction";
// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import HomeIcon from '@material-ui/icons/Home';
import AddCircle from '@material-ui/icons/AddCircle';
import AdminIcon from '@material-ui/icons/SupervisorAccount';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {newOrder} from "../redux/actions/dataAction";
import {withRouter} from "react-router-dom";
import BackIcon from '@material-ui/icons/ArrowBack';
import Typography from "@material-ui/core/Typography";
import {toNumber} from "../util/id_number";

const {Link} = require("react-router-dom");


const styles = {
    leftButton: {
        display: 'inline-block',
        float: 'left',
    },
    rightButton: {
        display: 'inline-block',
        float: 'right',
    },
    navbarMenu: {
        margin: 'auto',
    }
};

class Navbar extends Component {

    handleLogout = () => {
        this.props.logoutUser();
    };

    render() {
        const {classes, authenticated, isAdmin} = this.props;
        const btnProps = {
            variant: 'contained',
            color: 'secondary',
            size: 'small',
        };

        return (authenticated &&
            <AppBar>
                <Toolbar className="nav-container">

                    {this.props.location.pathname === '/order' && (
                        <IconButton
                            {...btnProps}
                            className={classes.leftButton}
                            component={Link}
                            to="/">
                            <BackIcon/>
                        </IconButton>
                    )}

                    <Box className={classes.navbarMenu}>

                        {this.props.location.pathname === '/order' &&
                        this.props.order.orderID && (
                            <Box component="span" m={1}>
                                <Typography variant='h6' color='secondary'>
                                    {toNumber(this.props.order.orderID)}
                                </Typography>
                            </Box>
                        )}

                        {this.props.location.pathname === '/admin' && (
                            <Box component="span" m={1}>
                                <Button {...btnProps} component={Link} to="/" startIcon={<HomeIcon/>}>
                                    Accueil
                                </Button>
                            </Box>
                        )}

                        {this.props.location.pathname !== '/order' &&
                        this.props.location.pathname !== '/admin' && (
                            <Box component="span" m={1}>
                                <Button
                                    {...btnProps}
                                    endIcon={<AddCircle/>}
                                    onClick={() => this.props.newOrder(this.props.history)}
                                >
                                    Commander
                                </Button>
                            </Box>
                        )}

                        {isAdmin && (
                            <Box component="span" m={1}>
                                <IconButton {...btnProps} component={Link} to="/admin">
                                    <AdminIcon/>
                                </IconButton>
                            </Box>)
                        }
                    </Box>

                    <IconButton
                        {...btnProps}
                        className={classes.rightButton}
                        onClick={this.handleLogout}
                        component={Link}
                        to="/"
                    >
                        <ExitToAppIcon/>
                    </IconButton>

                </Toolbar>
            </AppBar>
        );

    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    order: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    isAdmin: state.user.details.isAdmin,
    order: state.data.order,
});

const mapActionsToProps = {
    newOrder,
    logoutUser,
};


export default connect(mapStateToProps, mapActionsToProps)(withRouter(withStyles(styles)(Navbar)));