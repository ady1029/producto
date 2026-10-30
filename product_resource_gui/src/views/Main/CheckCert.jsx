import { Button, Typography } from '@material-ui/core';
import React from 'react';


const CheckCert = props => {



    return (
        <div>
            <Typography component={'div'} variant="body1" gutterBottom>
                Su navegador no reconoce el certificado de seguridad del Servidor de Identidad presione 
                <a href='https://is.aica.cu:9444/oauth2/oidcdiscovery/.well-known/openid-configuration' target='blank'> aquí </a>
                para abrirlo en una nueva pestaña, acepte el certificado y vuelva a intentar iniciar sesión.
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem' }}>
                <Button variant="contained" onClick={() => { props.closeModal() }} style={{ margin: '0.25rem' }}>Cerrar</Button>
            </div>
        </div>


        // <iframe src="https://is.aica.cu:9444/oauth2/oidcdiscovery/.well-known/openid-configuration" width="100%" height="450"></iframe>

    );
}

export default CheckCert;