import React, {Component} from 'react';
import PropTypes from 'prop-types'

import OrderCard from '../components/OrderCard'
import withStyles from "@material-ui/core/styles/withStyles";

import {connect} from 'react-redux'
import {getFutureOrders, getPastOrders} from "../redux/actions/dataAction";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import DeleteDialog from "../components/DeleteDialog";
import Container from "@material-ui/core/Container";

const styles = {
    root: {},
    allOrders: {
        marginBottom: 10,
        margin: 'auto',
    },
    ordersTitle: {
        textAlign: 'center',
        margin: '5px 0 10px 0',
    },
    orderCard: {
        marginBottom: 5,
    },
};

class MyOrdersPage extends Component {

    componentDidMount() {
        this.props.getFutureOrders();
        this.props.getPastOrders();
    }

    render() {
        const {classes, data: {futureOrders, pastOrders, loading}} = this.props;

        const ordersToMarkup = (orders) => {
            if (orders.length === 0) {
                if (loading) {
                    return <LinearProgress/>
                }
                return <Typography variant="body1">Aucune commande pour le moment</Typography>
            }
            return orders.map(order =>
                <div className={classes.orderCard} key={order.orderID}>
                    <OrderCard order={order}/>
                </div>
            )
        };

        return (
            <Container>
                <Grid container className={classes.root}>
                    <Grid item sm/>
                    <Grid item md className={classes.allOrders}>
                        <div className={classes.ordersContainer}>
                            <Typography className={classes.ordersTitle} variant='h5'>Commandes en cours</Typography>
                            {ordersToMarkup(futureOrders)}
                        </div>
                        {pastOrders.length !== 0 && (
                            <div className={classes.ordersContainer}>
                                <Typography className={classes.ordersTitle} variant='h5'>Commandes passées</Typography>
                                {ordersToMarkup(pastOrders)}
                            </div>
                        )}
                    </Grid>
                    <Grid item sm/>
                </Grid>

                <DeleteDialog/>
            </Container>
        );
    }
}

MyOrdersPage.propTypes = {
    getFutureOrders: PropTypes.func.isRequired,
    getPastOrders: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    data: state.data,
});

const mapActionToProps = {
    getFutureOrders,
    getPastOrders,
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(MyOrdersPage));