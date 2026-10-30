import * as axios from './axios';


export const getMistral = async (cod_ueb, type, seacrh, detail = 0) => {

    const response = await axios.mistral.get('/mistral?ueb=' + cod_ueb + '&almacen=' + type + '&buscar=' + seacrh + '&detalle=' + detail)
        .catch(error => {
            console.log('error', error)
            throw new Error("Ha ocurrido un error al intentar obtener la información de mistral");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}