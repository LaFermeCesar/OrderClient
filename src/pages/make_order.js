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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import LinearProgress from "@material-ui/core/LinearProgress";
import SwissDate from "../util/swiss_date";
import Container from "@material-ui/core/Container";

import http from '../util/http'

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
    }
};

const DEFAULT_DAYS_OF_WEEK = [2, 3, 5, 6]

class OrderPage extends Component {

    constructor(props) {
        super(props);

        let daysOfWeek = DEFAULT_DAYS_OF_WEEK;
        const order = props.location.order;

        if (order) {
            order.location = props.data.idToLoc[order.locationID];
            order.breadList = order.breadList.map(breadOrder => ({
                ...breadOrder,
                bread: props.data.idToBread[breadOrder.breadID]
            }))
            daysOfWeek = order.location.daysOfWeek;
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
            errors: {},
            loading: false,
            openAlert: false,
            orderInTime: undefined,
            showDeleteAlert: false,
        };
    };

    newBreadOrder = () => ({
        breadID: '',
        quantity: 1,
        bread: {
            name: '',
            desc: '',
            unitName: 'kg',
            unitStep: 0.5,
        }
    });

    makeOrder = () => {
        this.setState({
            loading: true,
        });
        http.post('/order', this.state.order)
            .then(() => {
                const dayDif = new SwissDate(this.state.order.locationDate).dayDifference(SwissDate.now())
                console.log(dayDif, 'day difference');
                if (dayDif > (2 + this.state.order.location.isMarket)) {
                    this.setState({
                        orderInTime: true,
                    });
                } else {
                    this.setState({
                        orderInTime: false,
                    });
                }
                this.setState({
                    openAlert: true,
                });
            })
            .catch((err) => {
                console.log(err.response);
                if (err.status === 403) {
                    window.location.reload(false);
                }
                this.setState({
                    errors: err.response.data,
                })
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    deleteOrder = () => {
        this.setState({
            loading: true,
        });
        http.post('/delete_order', {orderID: this.state.order.orderID})
            .then(() => {
                this.props.history.push('');
                window.location.reload(false);
            })
            .catch((err) => {
                console.log(err.response);
                if (err.status === 403) {
                    window.location.reload(false);
                }
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    handleCloseAlert = () => {
        this.setState({
            openAlert: false,
            orderInTime: undefined,
        });
        this.props.history.push('/');
        window.location.reload(false);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.makeOrder();
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

    addBread = () => {
        this.setState({
            order: {
                ...this.state.order,
                breadList: [...this.state.order.breadList.filter(b => b.quantity > 0), this.newBreadOrder()]
            }
        });
    };

    render() {

        const {classes, data: {idToBread, idToLoc}} = this.props;

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
                                error={!!this.state.errors.locationID}
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
                                error={!!this.state.errors.locationDate}
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
                                            error={!!this.state.errors[`breadList_breadID_${index}`]}
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
                                            error={!!this.state.errors[`breadList_quantity_${index}`]}
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
                        <Grid className={classes.buttonContainer} item sm={3 + !this.state.order.orderID} xs={12}>

                            <Button
                                className={classes.button}
                                onClick={this.addBread}
                                variant='contained'
                                color='primary'
                                endIcon={<AddIcon/>}
                                disabled={this.state.loading}
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
                                disabled={this.state.loading}
                            >
                                {this.state.order.orderID ? 'Appliquer les changements' : 'Passer commande'}
                            </Button>
                        </Grid>
                        <Grid className={classes.buttonContainer} item sm={3} xs={12}>

                            <Button
                                className={classes.button}
                                onClick={() => this.props.history.push('/')}
                                variant='contained'
                                color='primary'
                                endIcon={<ClearIcon/>}
                                disabled={this.state.loading}
                            >
                                Annuler
                            </Button>
                        </Grid>

                        {this.state.order.orderID ? (
                            <Grid className={classes.buttonContainer} item sm={2} xs={12}>
                                <Button
                                    className={classes.button}
                                    onClick={() => {
                                        this.setState({showDeleteAlert: true})
                                    }}
                                    variant='contained'
                                    color='primary'
                                    endIcon={<DeleteIcon/>}
                                    disabled={this.state.loading}
                                >
                                    Supprimer
                                </Button>
                            </Grid>) : ''}
                    </Grid>
                </form>

                {this.state.loading && (
                    <Grid className={classes.progressContainer} item sm={6} xs={10}>
                        <LinearProgress/>
                    </Grid>
                )}

                <Dialog
                    open={this.state.openAlert}
                >
                    <DialogTitle>{this.state.orderInTime ? `Commande réussie` : `Commande hors délai`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.orderInTime ? `Votre commande a bien été enregistré` :
                                `Votre commande a bien été enregistré. Néanmoins, la production a déjà débuté.
                            Nous ne pouvons donc pas garantir à 100% la disponibilité de tous les produits demandés.
                            Nous ferons au mieux pour vous contacter en cas d'indisponibilité.
                            Merci de votre compréhension.`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseAlert} color="primary" autoFocus>
                            {this.state.orderInTime ? `Merci` : `J'ai compris`}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.showDeleteAlert}
                >
                    <DialogTitle>Suppression de commande</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Vous êtes en train de supprimer votre commande de pain.
                            Êtes-vous sûr de vouloir continuer cette opération ?
                            (merci de minimiser les annulations de commande au maximum dans le futur)
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({showDeleteAlert: false})} color="primary" autoFocus>
                            Annuler
                        </Button>
                        <Button onClick={this.deleteOrder} color="primary">
                            Confirmer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}

OrderPage.propTypes = {
    order: PropTypes.object,
    data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    data: state.data,
    // UI: state.UI,
});

export default connect(mapStateToProps)(withStyles(styles)(OrderPage));