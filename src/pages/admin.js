import React, {Component} from 'react';
import PropTypes from 'prop-types'

import withStyles from "@material-ui/core/styles/withStyles";

import {connect} from 'react-redux'
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {DatePicker} from "@material-ui/pickers";
import SwissDate from "../util/swiss_date";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import http from '../util/http'
import TextField from "@material-ui/core/TextField";
import dayjs from "dayjs";
import {editOrder} from "../redux/actions/dataAction";

const styles = {
    fieldContainer: {
        margin: 'auto',
        textAlign: 'center',
    },
};

const MARKET_DAYS = [6];

class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marketDate: SwissDate.next(MARKET_DAYS).string,
            orderNumber: '',
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleDateChange = (date) => {
        const dateString = new SwissDate(date.toDate()).string;
        this.setState({
            marketDate: dateString,
        });
    };

    shouldDisableDate = (date) => !MARKET_DAYS.includes(new SwissDate(date.toDate()).day);

    handleDownload = (url, date, filename) => () => {
        const params = {date: date}
        filename = `${filename}_${dayjs(date).format('YYYY-MM-DD-HH-MM')}.xlsx`
        http.get(url, {
            responseType: 'arraybuffer',
            params,
        })
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
    }

    handleModifyOrder = () => {
        http.post('/order_number', {orderNumber: this.state.orderNumber})
            .then(res => {
                const order = res.data
                if (order && order.orderID) {
                    this.props.editOrder(order, this.props.history)
                }
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    render() {
        const {classes} = this.props;

        return (
            <Container>

                <Grid container spacing={3}>

                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                        <Typography variant='body1'>Pour le marché du:</Typography>
                    </Grid>

                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                        <DatePicker
                            clearable
                            variant='outlined'
                            format="YYYY-MM-DD"
                            name="productionDate"
                            value={this.state.marketDate}
                            onChange={this.handleDateChange}
                            shouldDisableDate={this.shouldDisableDate}
                            fullWidth
                        />
                    </Grid>

                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                        <Button variant='contained' color='primary'
                                onClick={this.handleDownload('/quantity_sheet', this.state.marketDate, 'quantites')}
                        >
                            Télécharger les quantités
                        </Button>
                    </Grid>

                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                        <Button variant='contained' color='primary'
                                onClick={this.handleDownload('/orders_sheet', this.state.marketDate, 'commandes')}
                        >
                            Télécharger les commandes
                        </Button>
                    </Grid>

                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                        <TextField
                            className={classes.textField}
                            variant='outlined'
                            id='orderNumber'
                            name='orderNumber'
                            label='Numéro de commande'
                            value={this.state.orderNumber}
                            onChange={this.handleChange}
                            fullWidth/>
                    </Grid>

                    <Grid className={classes.fieldContainer} item sm={6} xs={12}>
                        <Button variant='contained' color='primary'
                                onClick={this.handleModifyOrder}
                        >
                            Modifier la commande
                        </Button>
                    </Grid>

                </Grid>
            </Container>
        );
    }
}

AdminPage.propTypes = {
    data: PropTypes.object.isRequired,
    editOrder: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    data: state.data,
});

const mapActionToProps = {
    editOrder
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(AdminPage));