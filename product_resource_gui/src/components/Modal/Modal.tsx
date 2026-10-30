import React, { Component } from 'react';
import "./Modal.scss"
// import 'react-responsive-modal/styles.css';

import { Modal } from "react-responsive-modal";


interface Props {
    title: string;
    view: any;
    data: any;
    parse?: any;
    setChange;
}

class CustomModal extends Component<Props> {
    modal = React.createRef();
    state = {
        open: false,
        parse: undefined
    }

    handleOpen = (parse) => {
        this.setState({ open: true, parse: parse });
    };

    handleClose = () => {
        this.setState({ open: false, });
    };

    render() {
        return (

            <Modal
                open={this.state.open}
                onClose={this.handleClose}
                closeOnEsc={false}
                closeOnOverlayClick={false}
            >
                <h2>{this.props.title}</h2>
                <this.props.view
                    data={this.props.data}
                    parse={this.state.parse}
                    setChange={(item) => { this.props.setChange(item) }}
                    closeModal={() => this.handleClose()}
                />
            </Modal>


        );
    }


}

export default CustomModal;