import * as axios from './axios';

export const getAllResource = async (idResourceFamily, query) => {

    let ueb = "";
    let storage = "";
    let name = "";
    let codigo = "";
    let mistralCount = "";

    query.filters.forEach(element => {
        switch (element.column.field) {
            case "ueb":
                ueb = element.value;
                break;
            case "storage":
                storage = element.value;
                break;
            case "name":
                name = element.value;
                break;
            case "codigo":
                codigo = element.value;
                break;
            case "mistralCount":
                mistralCount = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field : "";
    const response = await axios.api_v1.get('/resource?idResourceFamily=' + idResourceFamily + '&ueb=' + ueb + '&storage=' + storage +
        '&name=' + name + '&codigo=' + codigo + '&mistralCount=' + mistralCount +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const getAllResourceList = async (idResourceFamily) => {

    const response = await axios.api_v1.get('/resource/list?idResourceFamily=' + idResourceFamily)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los recursos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const updateResource = (data) => {

    return async () => {

        const response = await axios.api_v1.put('/resource', data)
            .catch(error => {
                throw new Error("Ha ocurrido un error al intentar editar el recurso.");
            });

        if (response.status !== 200) {
            throw new Error("Error de la api ");
        } else {
            return true;
        }

    }

}


export const deleteResource = async (id) => {

    const response = await axios.api_v1.delete('/resource/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar el recurso.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado el recurso correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar el recurso. Todas las familias tienen que tener asociado al menos un recurso.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar el recurso. Ha ocurrido un error en el servidor.");
    }

}