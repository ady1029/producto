import * as axios from './axios';


export const getOpenIDConfiguration = async () => {

    const response = await axios.is.get('/.well-known/openid-configuration')
        .catch(error => {
            console.log('error 1', error);
            throw new Error("Ha ocurrido un error al intentar obtener la configuración de openid.");
        });

    if (response.status !== 200) {
        console.log('error 2', response);
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}