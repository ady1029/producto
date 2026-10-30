import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-responsive-modal";
import "./Confirm.scss"

import { confirmable, createConfirmation } from "react-confirm";
import { Button, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import Theme from "../../styles/Theme";


class Confirmation extends React.Component {
  render() {
    const {
      title,
      confirmation,
      show,
      proceed,
    } = this.props;
    return (
      <ThemeProvider theme={Theme}>
        <div className="static-modal">
          <Modal
            open={show}
            onClose={() => proceed(false)}
            classNames={{
              modal: 'confirm',
            }}
          >
            <h2>{title}</h2>
            <Typography variant="body1" >{confirmation}</Typography>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem' }}>
              <Button variant="contained" style={{ margin: '0.25rem' }} onClick={() => proceed(false)} >Cancelar</Button>
              <Button variant="contained" style={{ margin: '0.25rem' }} color="primary" onClick={() => proceed(true)}>Aceptar</Button>
            </div>
          </Modal>
        </div>
      </ThemeProvider>
    );
  }
}

Confirmation.propTypes = {
  okLabbel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
};

export function confirm(
  options = {}
) {
  return createConfirmation(confirmable(Confirmation))({
    ...options
  });
}
