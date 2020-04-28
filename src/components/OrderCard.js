import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import dayjs from "dayjs";
import {dayToFrenchName, monthToFrenchName} from "../util/utils";
import {withRouter} from "react-router-dom";
import {styled} from "@material-ui/styles";
import InfoIcon from "@material-ui/icons/Info";
import RepeatIcon from "@material-ui/icons/Replay";
import DeleteIcon from "@material-ui/icons/Delete";
import SwissDate from "../util/swiss_date";
import IconButton from "@material-ui/core/IconButton";

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

    editClicked = () => {
        this.props.history.push({
            pathname: '/order',
            order: this.props.order,
        });
    };

    repeatClicked = () => {
        const order = {
            ...this.props.order,
        }
        delete order.orderID;
        delete order.locationDate;

        this.props.history.push({
            pathname: '/order',
            order,
        });
    };

    render() {
        const {classes, order} = this.props;

        const date = new SwissDate(order.locationDate);

        const day = dayToFrenchName(date.day).toLowerCase();
        const month = monthToFrenchName(date.month).toLowerCase();

        const buttonProps = {
            variant: 'contained',
            size: 'small',
        }

        const BlackIconButton = styled(IconButton)({
            // background: '#f44336',
            color: 'black',
            // "&:hover": {
            //     background: '#cd362a',
            // },
        });

        return (
            <Card variant='outlined' className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Typography variant='h6'>
                        Commande du {day} {dayjs(date.string).format('D')} {month}
                    </Typography>
                    <Typography variant='body2'>
                        Lieu: {order.location.name}
                    </Typography>
                    <Typography variant='body2'>
                        Date: {dayjs(date.string).format('DD/MM/YYYY')}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actionsContainer}>
                    <Button
                        {...buttonProps}
                        color='primary'
                        className={classes.actionButton}
                        endIcon={<InfoIcon/>}
                        onClick={this.editClicked}>
                        Consulter
                    </Button>
                    <Button
                        {...buttonProps}
                        color='secondary'
                        className={classes.actionButton}
                        endIcon={<RepeatIcon/>}
                        onClick={this.repeatClicked}>
                        Répéter
                    </Button>
                    {false && (
                        <BlackIconButton
                            className={classes.actionButton}
                        >
                            <DeleteIcon/>
                        </BlackIconButton>
                    )}
                </CardActions>
            </Card>
        );
    }
}

export default withRouter(withStyles(styles)(OrderCard));