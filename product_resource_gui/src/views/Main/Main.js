import { Chip, Typography } from "@material-ui/core";
import React from "react";
import classes from './../../styles/Main.css'
import { useAuth } from 'oidc-react';
import Modal from './../../components/Modal/Modal.tsx'

import * as ISRequest from '../../service/actions/ISRequest';
import CheckCert from '../../views/Main/CheckCert';

const Main = props => {

  const auth = useAuth();

  const isAuthenticated = auth && auth.userData;

  let modelIS = null

  const signIn = () => {
    ISRequest.getOpenIDConfiguration()
    .then(() => {
        auth.signIn();
    })
    .catch((error) => {
        modelIS.handleOpen({  })
    });
}

  return (
    <div className={classes.container}>
      <Modal
        ref={el => {
          modelIS = el;
        }}
        title="Acepte el certificado de seguridad del servidor de identidad"
        view={CheckCert}
        data={{}}
        setChange={(data) => { }}
      />
      <div className={classes.form}>
        <Typography variant="h4" gutterBottom color="primary">
          Bienvenido a la solución Producto-Recurso
        </Typography>
        <Typography variant="body1" gutterBottom style={{ paddingTop: 20, paddingBottom: 20 }}>
          El sistema Producto-Recurso tiene la función de hacer persistir las relaciones correspondientes entre los productos que son
          fabricados por la empresa y los recursos que son necesarios para su elaboración. Así como, brindar reportes detallados sobre
          dichas relaciones y las existencias de los productos y recursos en todos los almacenes de la empresa.
        </Typography>

        {!isAuthenticated &&
          <Typography component={'div'} variant="body1" gutterBottom>
            Para comenzar a utilizar <Chip color="primary" size="small" label="Inicie sesión" clickable onClick={signIn} /> utilizando su usuario y contraseña del Servidor de Identidad de AICA.
          </Typography>
        }
      </div>
    </div>
  );

}

export default Main;
