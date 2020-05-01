import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import dayjs from "dayjs";
import {withRouter} from "react-router-dom";
import {styled} from "@material-ui/styles";
import InfoIcon from "@material-ui/icons/Info";
import RepeatIcon from "@material-ui/icons/Replay";
import DeleteIcon from "@material-ui/icons/Delete";
import SwissDate from "../util/swiss_date";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import {editOrder, repeatOrder} from "../redux/actions/dataAction";
import {connect} from "react-redux";
import {askDeleteConfirm} from "../redux/actions/uiAction";
import {toNumber} from "../util/id_number";

const styles = {
    card: {
        width: '100%',
        position: 'relative',
        display: 'inline-block'
    },
    cardContent: {
        padding: '15px 25px 8px 25px',
    },
    actionsContainer: {
        padding: '8px 13px 15px 23px',
    },
    actionButton: {
        // marginRight: 10
    },
};


class OrderCard extends Component {

    handleEditClicked = () => {
        this.props.editOrder(this.props.order, this.props.history);
    };

    handleRepeatClicked = () => {
        this.props.repeatOrder(this.props.order, this.props.history);
    };

    handleDeleteClicked = () => {
        this.props.askDeleteConfirm(this.props.order);
    };


    render() {
        const {classes, order} = this.props;
        const date = new SwissDate(order.locationDate);

        const buttonProps = {
            variant: 'contained',
            size: 'small',
        }

        const BlackIconButton = styled(IconButton)({
            color: 'black',
        });

        return (
            <Card variant='outlined' className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Typography variant='h6'>
                        Commande n°{toNumber(order.orderID)}
                    </Typography>
                    <Typography variant='body2'>
                        Lieu: {order.location.name}
                    </Typography>
                    <Typography variant='body2'>
                        Date: {dayjs(date.string).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography variant='body2'>
                        Nombre de produits: {order.breadList.length}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actionsContainer}>
                    <Button
                        {...buttonProps}
                        color='primary'
                        className={classes.actionButton}
                        endIcon={<InfoIcon/>}
                        onClick={this.handleEditClicked}>
                        Consulter
                    </Button>
                    <Button
                        {...buttonProps}
                        color='secondary'
                        className={classes.actionButton}
                        endIcon={<RepeatIcon/>}
                        onClick={this.handleRepeatClicked}>
                        Répéter
                    </Button>
                    <BlackIconButton
                        size='small'
                        className={classes.actionButton}
                        onClick={this.handleDeleteClicked}
                    >
                        <DeleteIcon/>
                    </BlackIconButton>

                </CardActions>
            </Card>
        );
    }
}

OrderCard.propTypes = {
    order: PropTypes.object.isRequired,
    editOrder: PropTypes.func.isRequired,
    repeatOrder: PropTypes.func.isRequired,
    askDeleteConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    data: state.data,
});

const mapActionToProps = {
    editOrder,
    repeatOrder,
    askDeleteConfirm
};

export default connect(mapStateToProps, mapActionToProps)(withRouter(withStyles(styles)(OrderCard)));