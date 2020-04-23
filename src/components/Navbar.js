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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

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
        const {classes, authenticated} = this.props;
        const btnProps = {
            variant: 'contained',
            color: 'secondary',
        };

        return (authenticated &&
            <AppBar>
                <Toolbar className="nav-container">
                    <Box className={classes.navbarMenu}>
                        <Box component="span" m={1}>
                            <IconButton {...btnProps} component={Link} to="/">
                                <HomeIcon/>
                            </IconButton>
                        </Box>
                        <Box component="span" m={1}>
                            <Button {...btnProps} endIcon={<AddCircle/>} component={Link} to="/order">
                                Commander
                            </Button>
                        </Box>
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
    logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
});

const mapActionsToProps = {
    logoutUser,
};


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Navbar));