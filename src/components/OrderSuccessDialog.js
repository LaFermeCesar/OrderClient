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
        const linkMap = (s) => <a href="https://goo.gl/maps/vDCoMVvbhQ7wVbxm9" target='_blank'
                                  rel="noopener noreferrer">{s}</a>

        return (
            <Dialog
                open={this.props.UI.showOrderSuccess}
            >
                <DialogTitle>{this.props.UI.isOrderInTime ? `Commande réussie` : `Commande hors délai`}</DialogTitle>
                <DialogContent>
                    {this.props.UI.isOrderInTime ?
                        <DialogContentText>
                            <p>
                                Votre commande a bien été enregistrée.
                            </p>
                            <p>
                                <b>INFO</b>: Nous sommes de retour au marché de Lausanne.
                                Notre stand sera à la rue Saint-Laurent, entre la Coop City et la banque Clerc.
                                ({linkMap('lien vers notre stand')})
                            </p>
                        </DialogContentText> :
                        <DialogContentText>
                            Votre commande a bien été enregistrée. Néanmoins, la production a déjà débuté.
                            Nous ne pouvons donc pas garantir à 100% la disponibilité de tous les produits demandés.
                            Nous ferons au mieux pour vous contacter en cas d'indisponibilité.
                            Merci de votre compréhension.
                        </DialogContentText>
                    }
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