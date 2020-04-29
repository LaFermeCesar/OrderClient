import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {orderSuccessDone} from "../redux/actions/uiAction";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

class OrderSuccessDialog extends Component {

    handleCloseAlert = () => {
        this.props.orderSuccessDone();
        this.props.history.push('/');
    };

    render() {
        return (
            <Dialog
                open={this.props.UI.showOrderSuccess}
            >
                <DialogTitle>{this.props.UI.isOrderInTime ? `Commande réussie` : `Commande hors délai`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.UI.isOrderInTime ? `Votre commande a bien été enregistré` :
                            `Votre commande a bien été enregistré. Néanmoins, la production a déjà débuté.
                            Nous ne pouvons donc pas garantir à 100% la disponibilité de tous les produits demandés.
                            Nous ferons au mieux pour vous contacter en cas d'indisponibilité.
                            Merci de votre compréhension.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseAlert} color="primary" autoFocus>
                        {this.props.UI.isOrderInTime ? `Merci` : `J'ai compris`}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

OrderSuccessDialog.propTypes = {
    UI: PropTypes.object,
    orderSuccessDone: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    UI: state.UI,
});


const mapActionToProps = {
    orderSuccessDone,
};

export default connect(mapStateToProps, mapActionToProps)(withRouter(OrderSuccessDialog));