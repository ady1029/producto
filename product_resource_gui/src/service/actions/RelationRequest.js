import * as axios from './axios';

export const getAllRelation = async (query) => {

    let productFamilyEnterprise = "";
    let productFamilyName = "";
    let name = "";
    let criterio = "";
    let date = "";
    let baseCount = "";
    let resourceFamilyName = "";

    query.filters.forEach(element => {
        switch (element.column.field) {
            case "productFamilyEnterprise":
                productFamilyEnterprise = element.value;
                break;
            case "productFamilyName":
                productFamilyName = element.value;
                break;
            case "name":
                name = element.value;
                break;
            case "criterio":
                criterio = element.value;
                break;
            case "date":
                date = element.value;
                break;
            case "baseCount":
                baseCount = element.value;
                break;
            case "resourceFamilyName":
                resourceFamilyName = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field : "";
    const response = await axios.api_v1.get('/relation?productFamilyEnterprise=' + productFamilyEnterprise +
        '&productFamilyName=' + productFamilyName + '&name=' + name + '&criterio=' + criterio +
        '&date=' + date + '&baseCount=' + baseCount + '&resourceFamilyName=' + resourceFamilyName +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las relaciones.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const getRelation = async (id) => {

    const response = await axios.api_v1.get('/relation/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener la relación.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const createRelation = async (data) => {

    const response = await axios.api_v1.post('/relation', data)
        .catch(error => {
            throw error;
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const updateRelation = async (data) => {

    const response = await axios.api_v1.put('/relation', data)
        .catch(error => {
            throw error;
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const deleteRelation = async (id) => {

    const response = await axios.api_v1.delete('/relation/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar la relación.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado la relación correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar la relación porque tiene dependencia con una relación de envase terciario.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar la relación. Ha ocurrido un error en el servidor.");
    }

}