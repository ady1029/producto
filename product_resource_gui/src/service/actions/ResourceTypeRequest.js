import * as axios from './axios';


export const getAllResourceType = async (query) => {

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
    const response = await axios.api_v1.get('/resource_type?enterprise=' + enterprise + '&name=' + name +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los tipos de recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}


export const getResourceTypeList = async (idEnterprise, name = "") => {

    const response = await axios.api_v1.get('/resource_type/list?idEnterprise=' + idEnterprise + '&name=' + name)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los tipos de recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {

        return response.data;
    }
}

export const getResourceType = async (id) => {

    const response = await axios.api_v1.get('/resource_type/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener el tipo de recurso.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const createResourceType = async (data) => {

    const response = await axios.api_v1.post('/resource_type', data)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar insertar el tipo de recurso.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const updateResourceType = async (data) => {

    const response = await axios.api_v1.put('/resource_type', data)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar insertar el tipo de recurso.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const deleteResourceTyoe = async (id) => {

    const response = await axios.api_v1.delete('/resource_type/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar el tipo de recurso.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado el tipo recurso correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar el tipo recurso. Existe al menos un recurso con este tipo asociado.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar el tipo recurso. Ha ocurrido un error en el servidor.");
    }

}