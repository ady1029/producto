import * as axios from './axios';


export const getAllResourceFamily = async (query) => {

    let enterprise = "";
    let name = "";
    query.filters.forEach(element => {
        switch (element.column.field) {
            case "enterprise":
                enterprise = element.value;
                break;
            case "name":
                name = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field : "";
    const response = await axios.api_v1.get('/resource_family?enterprise=' + enterprise + '&name=' + name +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las familias de recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const getResourceFamilyList = async (idEnterprise, enterprise = "", name = "", idProductFamily = -1, relationCriteria = "", resourceType = "") => {

    const response = await axios.api_v1.get('/resource_family/list?idEnterprise=' + idEnterprise +
        '&enterprise=' + enterprise + '&name=' + name +
        '&idProductFamily=' + idProductFamily + '&relationCriteria=' + relationCriteria + '&resourceType=' + resourceType)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las familias de recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {

        return response.data;
    }

}

export const getResourceFamily = async (id) => {

    const response = await axios.api_v1.get('/resource_family/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener la familia de recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const createResourceFamily = async (data) => {

    const response = await axios.api_v1.post('/resource_family', data)
        .catch(error => {
            throw error;
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const updateResourceFamily = async (data) => {

    const response = await axios.api_v1.put('/resource_family', data)
        .catch(error => {
            throw error;
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const deleteResourceFamily = async (id) => {

    const response = await axios.api_v1.delete('/resource_family/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar la familia de recursos.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado la familia de recursos correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar la familia de recursos porque tiene relaciones asociadas.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar la familia de recursos. Ha ocurrido un error en el servidor.");
    }

}