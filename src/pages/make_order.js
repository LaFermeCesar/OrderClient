import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {DatePicker} from '@material-ui/pickers';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LinearProgress from "@material-ui/core/LinearProgress";
import SwissDate from "../util/swiss_date";
import Container from "@material-ui/core/Container";
import {cancelOrder, postOrder, updateSelectedOrder} from "../redux/actions/dataAction";
import OrderSuccessDialog from "../components/OrderSuccessDialog";
import DeleteDialog from "../components/DeleteDialog";
import {askDeleteConfirm} from "../redux/actions/uiAction";
import Typography from "@material-ui/core/Typography";

const styles = {
    form: {
        paddingBottom: 20,
    },
    gridContainer: {
        margin: 'auto',
        width: '100%',
        maxWidth: 720,
    },
    fieldContainer: {
        margin: 'auto',
    },
    buttonContainer: {
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
        position: 'relative',
    },
    breadSeparator: {
        width: '100%',
        height: 0.1,
    },
    multipleOf: {
        fontSize: '70%',
        paddingLeft: 5,
    },
    progressContainer: {
        margin: 'auto',
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 0,
    },
    errorContainer: {
        textAlign: 'center',
    },
};

const DEFAULT_DAYS_OF_WEEK = [2, 3, 5, 6]

class OrderPage extends Component {

    constructor(props) {
        super(props);

        let daysOfWeek = DEFAULT_DAYS_OF_WEEK;
        const order = this.props.data.order;

        if (order.locationID) {
            order.location = props.data.idToLoc[order.locationID];
            daysOfWeek = order.location.daysOfWeek;
        }

        if (order.breadList) {
            order.breadList = order.breadList
                .map(b => ({
                    ...b,
                    bread: this.mapIDToBread(b.breadID),
                }))
        }

        this.state = {
            order: {
                locationDate: SwissDate.now().plus(1).next(daysOfWeek).string,
                locationID: '',
                location: {
                    name: '',
                    isMarket: false,
                    daysOfWeek: daysOfWeek,
                },
                breadList: [this.newBreadOrder()],
                ...order,
            },
        };
    };

    mapIDToBread = (id) => {
        if (!id || !this.props.data.idToBread[id]) {
            return {
                name: '',
                desc: '',
                unitName: 'kg',
                unitStep: 0.5,
            }
        }
        return this.props.data.idToBread[id];
    }

    newBreadOrder = () => ({
        breadID: '',
        quantity: 1,
        bread: this.mapIDToBread()
    });

    handlePostClicked = () => {
        this.props.postOrder(this.state.order);
    };

    handleDeleteClicked = () => {
        this.props.askDeleteConfirm(this.props.data.order);
    };

    handleCancelClicked = () => {
        this.props.cancelOrder(this.props.history);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.handlePostClicked();
    };

    handleChange = (event) => {
        this.setState({
            order: {
                ...this.state.order,
                [event.target.name]: event.target.value,
            }
        });
    };

    handleLocChange = (event, idToLoc) => {
        const locationID = event.target.value;
        if (locationID !== '') {
            const location = idToLoc[locationID];
            let locationDate = new SwissDate(this.state.order.locationDate);
            if (!location.daysOfWeek.includes(locationDate.day)) {
                locationDate = SwissDate.next(location.daysOfWeek);
            }

            locationDate = locationDate.string;
            this.setState({
                order: {...this.state.order, locationDate, locationID, location}
            });
        } else {
            this.handleChange(event);
        }
    };

    handleDateChange = (date) => {
        const locationDate = new SwissDate(date.toDate()).string;
        this.setState({
            order: {
                ...this.state.order,
                locationDate,
            }
        });
    };

    handleBreadChange = (event, breadIndex) => {
        const breadID = event.target.value;
        if (breadID !== '') {
            const bread = this.props.data.idToBread[breadID];
            this.setState({
                order: {
                    ...this.state.order,
                    breadList: this.state.order.breadList.map((b, i) => {
                        if (i === breadIndex) {
                            return {...b, breadID, bread, quantity: b.quantity}
                        } else {
                            return b
                        }
                    }),
                }
            });
        } else {
            this.setState({
                order: {
                    ...this.state.order,
                    breadList: this.state.order.breadList.map((b, i) => {
                        if (i === breadIndex) {
                            return this.newBreadOrder()
                        } else {
                            return b
                        }
                    }),
                }
            });
        }
    };

    handleQuantityChange = (event, breadIndex) => {
        const quantity = event.target.value.replace(',', '.').replace(/[^\d.-]/g, '');

        this.setState({
            order: {
                ...this.state.order,
                breadList: this.state.order.breadList
                    .map((b, i) => {
                        if (i === breadIndex) {
                            return {...b, quantity}
                        } else {
                            return b
                        }
                    }),
            }
        });
    };

    addBread = () => {
        this.setState({
            order: {
                ...this.state.order,
                breadList: [...this.state.order.breadList.filter(b => b.quantity > 0), this.newBreadOrder()]
            }
        });
    };

    removeBread = (breadIndex) => {
        this.setState({
            order: {
                ...this.state.order,
                breadList: this.state.order.breadList
                    .filter((b, i) => this.state.order.breadList.length < 2 || i !== breadIndex),
            }
        })
    };

    shouldDisableDate = (date) => {
        return !this.state.order.location.daysOfWeek.includes(new SwissDate(date.toDate()).day)
            || new SwissDate(date.toDate()).dayDifference(SwissDate.now()) < 1;
    };

    render() {

        const {classes, data: {idToBread, idToLoc}, UI: {loading, errors}} = this.props;

        const breads = Object.values(idToBread)
            .sort((l, r) => l.name.localeCompare(r.name));
        const locations = Object.values(idToLoc)
            .sort((l, r) => l.name.localeCompare(r.name));

        // const catToName = {
        //     levain: 'Pains au levain',
        //     levure: 'Tresses et cuchaules',
        //     'sans-gluten': 'Pains sans-gluten',
        //     'petit-pain': 'Petits pains',
        //     autre: 'Autres'
        // };

        return (
            <Container>
                <form noValidate className={classes.form} onSubmit={this.handleSubmit}>
                    <Grid container spacing={3} className={classes.gridContainer}>
                        <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                            <Select
                                variant='outlined'
                                name='locationID'
                                value={this.state.order.locationID}
                                disabled={loading}
                                error={!!errors.locationID}
                                onChange={(event) => this.handleLocChange(event, idToLoc)}
                                displayEmpty
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Selectionnez le point de vente</em>
                                </MenuItem>
                                {locations.map(loc => (
                                    <MenuItem key={loc.locationID} value={loc.locationID}>{loc.name}</MenuItem>))}
                            </Select>
                        </Grid>
                        <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                            <DatePicker
                                clearable
                                variant='outlined'
                                format="DD/MM/YYYY"
                                name="locationDate"
                                value={this.state.order.locationDate}
                                disabled={loading}
                                error={!!errors.locationDate}
                                onChange={this.handleDateChange}
                                shouldDisableDate={this.shouldDisableDate}
                                fullWidth
                            />
                        </Grid>
                        {this.state.order.breadList.map((breadOrder, index) => {
                            return (
                                <Fragment key={index}>
                                    <hr color='primary' className={classes.breadSeparator}/>
                                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                                        <Select
                                            variant='outlined'
                                            name='breadID'
                                            value={breadOrder.breadID}
                                            disabled={loading}
                                            error={!!errors[`breadList_breadID_${index}`]}
                                            onChange={(event) => this.handleBreadChange(event, index)}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="">
                                                <em>Choisissez votre pain</em>
                                            </MenuItem>

                                            {breads.map(b => (
                                                <MenuItem key={b.breadID} value={b.breadID}>
                                                    {b.name}
                                                </MenuItem>)
                                            )}
                                        </Select>
                                    </Grid>
                                    <Grid className={classes.fieldContainer} item sm={4} xs={10}>
                                        <TextField
                                            variant='outlined'
                                            name='quantity'
                                            value={breadOrder.quantity}
                                            disabled={loading}
                                            error={!!errors[`breadList_quantity_${index}`]}
                                            onChange={(event) => this.handleQuantityChange(event, index)}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">
                                                    <b>{breadOrder.bread.unitName}</b>
                                                    <em className={classes.multipleOf}>
                                                        (multiple de {breadOrder.bread.unitStep})
                                                    </em>
                                                </InputAdornment>,
                                            }}
                                            inputProps={{
                                                min: 0,
                                                step: breadOrder.bread.unitStep,
                                            }}
                                            fullWidth
                                        >
                                        </TextField>
                                    </Grid>
                                    <Grid className={classes.fieldContainer} item sm={2} xs={2}>
                                        <IconButton color='primary' onClick={() => this.removeBread(index)}>
                                            <ClearIcon/>
                                        </IconButton>
                                    </Grid>
                                </Fragment>
                            )
                        })}
                        <Grid item xs={12} className={classes.errorContainer}>
                            {(errors.locationID && (
                                <Typography variant='body2' className={classes.customError}>
                                    Le point de vente sélectionné est invalide
                                </Typography>
                            )) || (errors.locationDate && (
                                <Typography variant='body2' className={classes.customError}>
                                    La date sélectionnée est invalide
                                </Typography>
                            )) || (this.state.order.breadList.find((_, i) => errors[`breadList_breadID_${i}`]) && (
                                <Typography variant='body2' className={classes.customError}>
                                    Le pain sélectionné est invalide
                                </Typography>
                            )) || (this.state.order.breadList.find((_, i) => errors[`breadList_quantity_${i}`]) && (
                                <Typography variant='body2' className={classes.customError}>
                                    La quantité de pain sélectionnée est invalide
                                </Typography>
                            ))}
                        </Grid>
                        <Grid className={classes.buttonContainer} item sm={3 + !this.state.order.orderID} xs={12}>

                            <Button
                                className={classes.button}
                                onClick={this.addBread}
                                variant='contained'
                                color='primary'
                                endIcon={<AddIcon/>}
                                disabled={loading}
                            >
                                Ajouter un pain
                            </Button>
                        </Grid>
                        <Grid className={classes.buttonContainer} item sm={4 + !this.state.order.orderID} xs={12}>

                            <Button
                                className={classes.button}
                                type='submit'
                                variant='contained'
                                color='primary'
                                endIcon={<SendIcon/>}
                                disabled={loading}
                            >
                                {this.state.order.orderID ? 'Appliquer les changements' : 'Passer commande'}
                            </Button>
                        </Grid>
                        <Grid className={classes.buttonContainer} item sm={3} xs={12}>

                            <Button
                                className={classes.button}
                                onClick={this.handleCancelClicked}
                                variant='contained'
                                color='primary'
                                endIcon={<ClearIcon/>}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                        </Grid>

                        {this.state.order.orderID ? (
                            <Grid className={classes.buttonContainer} item sm={2} xs={12}>
                                <Button
                                    className={classes.button}
                                    onClick={this.handleDeleteClicked}
                                    variant='contained'
                                    color='primary'
                                    endIcon={<DeleteIcon/>}
                                    disabled={loading}
                                >
                                    Supprimer
                                </Button>
                            </Grid>) : ''}
                    </Grid>
                </form>

                {loading && (
                    <Grid className={classes.progressContainer} item sm={6} xs={10}>
                        <LinearProgress/>
                    </Grid>
                )}

                <OrderSuccessDialog/>
                <DeleteDialog/>

            </Container>
        );
    }
}

OrderPage.propTypes = {
    order: PropTypes.object,
    data: PropTypes.object.isRequired,
    updateSelectedOrder: PropTypes.func.isRequired,
    postOrder: PropTypes.func.isRequired,
    askDeleteConfirm: PropTypes.func.isRequired,
    cancelOrder: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    data: state.data,
    UI: state.UI,
});

const mapActionToProps = {
    updateSelectedOrder,
    postOrder,
    askDeleteConfirm,
    cancelOrder,
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(OrderPage));