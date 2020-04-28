import React, {Component} from 'react';
import PropTypes from 'prop-types'
// REDUX
import {connect} from 'react-redux';
import {loginUser} from "../redux/actions/userAction";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import AppLogo from '../images/logo.png';
import Container from "@material-ui/core/Container";

const styles = {
    form: {
        textAlign: 'center',
    },
    image: {
        maxWidth: '100%',
        margin: '0 auto 20px auto',
    },
    textField: {
        margin: '10px auto 10px auto',
    },
    button: {
        marginTop: 10,
        position: 'relative',
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10,
    },
    progress: {
        position: 'absolute',
    }
};

class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            lastName: '',
            firstName: '',
        }

    }


    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            phoneNumber: this.state.phoneNumber,
            lastName: this.state.lastName,
            firstName: this.state.firstName,
        };
        this.props.loginUser(userData, this.props.history)
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        const {classes, UI: {loading, errors}} = this.props;
        // const {errors} = this.state;

        return (
            <Container>
                <form noValidate onSubmit={this.handleSubmit}>
                    <Grid container spacing={3} className={classes.form}>
                        <Grid item sm/>
                        <Grid item sm>
                            <img className={classes.image} src={AppLogo} alt='company logo'/>
                            <Typography variant='h5'>Commande de pain et miel en ligne</Typography>

                            <TextField
                                className={classes.textField}
                                variant='outlined'
                                id='phoneNumber'
                                name='phoneNumber'
                                label='Numéro de téléphone'
                                value={this.state.phoneNumber}
                                onChange={this.handleChange}
                                // helperText={errors.phoneNumber}
                                error={!!errors.phoneNumber}
                                fullWidth/>
                            <TextField
                                className={classes.textField}
                                variant='outlined'
                                id='firstName'
                                name='firstName'
                                label='Prénom'
                                value={this.state.firstName}
                                onChange={this.handleChange}
                                // helperText={errors.name}
                                error={!!errors.firstName}
                                fullWidth/>
                            <TextField
                                className={classes.textField}
                                variant='outlined'
                                id='lastName'
                                name='lastName'
                                label='Nom de famille'
                                value={this.state.lastName}
                                onChange={this.handleChange}
                                // helperText={errors.name}
                                error={!!errors.lastName}
                                fullWidth/>
                            {errors.general && (
                                <Typography variant='body2' className={classes.customError}>
                                    {errors.general}. Vérifiez les valeurs entrées.
                                </Typography>
                            )}
                            {(errors.phoneNumber && (
                                <Typography variant='body2' className={classes.customError}>
                                    Le numéro de téléphone est invalide
                                </Typography>
                            )) || (errors.firstName && (
                                <Typography variant='body2' className={classes.customError}>
                                    Le prénom est invalide
                                </Typography>
                            )) || (errors.lastName && (
                                <Typography variant='body2' className={classes.customError}>
                                    Le nom est invalide
                                </Typography>
                            ))}
                            <Button
                                className={classes.button}
                                type='submit'
                                variant='contained'
                                color='primary'
                                disabled={loading}
                            >
                                Suivant
                                {loading && (
                                    <CircularProgress className={classes.progress} size={30}/>
                                )}
                            </Button>
                        </Grid>
                        <Grid item sm/>
                    </Grid>
                </form>
            </Container>
        );
    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
});

const mapActionsToProps = {
    loginUser,
};


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(LoginPage));