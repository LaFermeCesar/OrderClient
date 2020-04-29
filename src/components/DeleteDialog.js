import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {deleteOrder} from "../redux/actions/dataAction";
import {cancelDelete} from "../redux/actions/uiAction";
import PropTypes from "prop-types";

class DeleteDialog extends Component {

    handleCancel = () => {
        this.props.cancelDelete();
    };

    handleConfirm = () => {
        this.props.deleteOrder(this.props.UI.orderIDToDelete, this.props.history);
    };

    render() {
        return (
            <Dialog
                open={this.props.UI.showDeleteConfirm}
            >
                <DialogTitle>Suppression de commande</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vous êtes en train de supprimer votre commande de pain.
                        Êtes-vous sûr de vouloir continuer cette opération ?
                        (merci de minimiser les annulations de commande au maximum dans le futur)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary" autoFocus>
                        Annuler
                    </Button>
                    <Button onClick={this.handleConfirm} color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DeleteDialog.propTypes = {
    UI: PropTypes.object,
    cancelDelete: PropTypes.func.isRequired,
    deleteOrder: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    UI: state.UI,
});


const mapActionToProps = {
    cancelDelete,
    deleteOrder,
};

export default connect(mapStateToProps, mapActionToProps)(withRouter(DeleteDialog));