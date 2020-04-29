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

const {Link} = require("react-router-dom");


const styles = {
    logoutButton: {
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
                    <Box className={classes.navbarMenu}>
                        {this.props.location.pathname !== '/' && (<Box component="span" m={1}>
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
                        className={classes.logoutButton}
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
    logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    isAdmin: state.user.details.isAdmin,
});

const mapActionsToProps = {
    newOrder,
    logoutUser,
};


export default connect(mapStateToProps, mapActionsToProps)(withRouter(withStyles(styles)(Navbar)));