import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import dayjs from "dayjs";
import {dayToFrenchName} from "../util/utils";
import {withRouter} from "react-router-dom";

const styles = {
    card: {
        position: 'relative',
        marginBottom: 20,
    },
    cardContent: {
        padding: 25,
    },
    cardAction: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    }
};


class OrderCard extends Component {

    editClicked = () => {
        this.props.history.push({
            pathname: '/order',
            order: this.props.order,
        });
    };

    render() {
        const {classes, order} = this.props;

        const date = dayjs(order.locationDate);
        const day = dayToFrenchName(date.day());

        return (
            <Card variant='outlined' className={classes.card} onClick={this.editClicked}>
                <CardContent className={classes.cardContent}>
                    <Typography variant='h6'>
                        Commande du {day} {date.format('DD.MM')}
                    </Typography>
                    <Typography variant='body2'>
                        Lieu: {order.location.name}
                    </Typography>
                    <Typography variant='body2'>
                        Date: {date.format('DD/MM/YYYY')}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardAction}>
                    <Button size="small" onClick={this.editClicked}>Consulter</Button>
                </CardActions>
            </Card>
        );
    }
}

export default withRouter(withStyles(styles)(OrderCard));