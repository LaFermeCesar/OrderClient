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
import axios from 'axios';

const styles = {
    fieldContainer: {
        margin: 'auto',
        textAlign: 'center',
    },
};

const MARKET_DAYS = [3, 6];

class AdminPage extends Component {

    constructor(props) {
        super(props);


        this.state = {
            marketDate: SwissDate.next(MARKET_DAYS).string,
        };
    }

    handleDateChange = (date) => {
        const dateString = new SwissDate(date.toDate()).string;
        this.setState({
            marketDate: dateString,
        });
    };

    shouldDisableDate = (date) => !MARKET_DAYS.includes(new SwissDate(date.toDate()).day);

    downloadFile = (url, params, filename) => {
        axios
            .get(url, {
                responseType: 'arraybuffer',
                // headers: {
                //     'Content-Type': 'application/json',
                //     'Accept': 'application/xlsx'
                // },
                params,
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${filename}.xlsx`); //or any other extension
                document.body.appendChild(link);
                link.click();
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

                    <Grid className={classes.fieldContainer} item>
                        <Button variant='contained' color='primary'
                                onClick={() => this.downloadFile('/quantity_sheet', {
                                    date: this.state.marketDate,
                                }, 'quantites')}
                        >
                            Télécharger les quantités
                        </Button>
                    </Grid>

                    <Grid className={classes.fieldContainer} item xs={12}>
                        <Button variant='contained' color='primary'
                                onClick={() => this.downloadFile('/orders_sheet', {
                                    date: this.state.marketDate,
                                }, 'commandes')}
                        >
                            Télécharger les commandes
                        </Button>
                    </Grid>

                </Grid>
            </Container>
        );
    }
}

AdminPage.propTypes = {
    data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    data: state.data,
});

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(AdminPage));