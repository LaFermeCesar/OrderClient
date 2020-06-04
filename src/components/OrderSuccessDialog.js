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
                <DialogTitle>Commande réussie</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.UI.isOrderInTime ?
                            <div>
                                Votre commande a bien été enregistrée.
                            </div> :
                            <div>
                                Votre commande a bien été enregistrée.
                                Néanmoins, la production a déjà débuté.
                                En cas d'indisponibilité, nous ferons au mieux pour vous contacter.
                                Merci de votre compréhension.
                            </div>
                        }

                        <div>
                            <b>INFO</b>: Nous sommes de retour aux marchés de Lausanne et Vevey.
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseAlert} color="primary" autoFocus>
                        Merci
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