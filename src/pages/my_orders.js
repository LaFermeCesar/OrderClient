import React, {Component} from 'react';
import PropTypes from 'prop-types'

import OrderCard from '../components/OrderCard'
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

import {connect} from 'react-redux'
import {getFutureOrders, getPastOrders} from "../redux/actions/dataAction";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const styles = {
    ordersTitle: {
        marginBottom: 10,
    },
    ordersContainer: {
        margin: 'auto',
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
                    return <Typography variant="body1">chargement en cours...</Typography>
                }
                return <Typography variant="body1">Aucune commande pour le moment</Typography>
            }
            return orders.map(order =>
                <OrderCard key={order.orderID} order={order}/>
            )
        };

        return (
            <Container>
                <Grid container spacing={3}>
                    <Grid className={classes.ordersContainer} item sm={8} xs={12}>
                        <Typography className={classes.ordersTitle} variant='h4'>Commandes en cours</Typography>
                        {ordersToMarkup(futureOrders)}
                    </Grid>

                    <Grid className={classes.ordersContainer} item sm={8} xs={12}>
                        <Typography className={classes.ordersTitle} variant='h4'>Commandes passées</Typography>
                        {ordersToMarkup(pastOrders)}
                    </Grid>
                </Grid>
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