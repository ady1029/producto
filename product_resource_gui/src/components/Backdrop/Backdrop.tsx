import React, { Component } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class CustomBackdrop extends Component {
    loading = React.createRef();
    state = {
        open: false,
    }

    handleOpen = () => {
        this.setState({ open: true, });
    };

    handleClose = () => {
        this.setState({ open: false, });
    };

    handleToggle = () => {
        // this.setOpen(!open);
        this.setState({ open: !this.state.open, });
    };

    render() {
        return (
            <div>
                <Backdrop ref={this.loading}
                    style={{
                        zIndex: 2000,
                        color: '#fff',
                    }}
                    open={this.state.open} onClick={this.handleClose} >
                    <CircularProgress color="inherit" />
                </Backdrop >
            </div >
        );
    }
}

export default CustomBackdrop;