import * as axios from './axios';

export const resourcesByProduct = async (idProductFamily, count) => {

    const response = await axios.api_v1.get('/report/resource_by_product?idProductFamily=' + idProductFamily + "&count=" + count)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener el reporte.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const productByResources = async (idResourceFamily) => {

    const response = await axios.api_v1.get('/report/product_by_resource?idResourceFamily=' + idResourceFamily)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener el reporte.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const resourceExistences = async (idResourceFamily) => {

    const response = await axios.api_v1.get('/report/resource_existence?idResourceFamily=' + idResourceFamily)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener el reporte.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}