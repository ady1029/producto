import * as axios from './axios';


export const getAllResourceFamilyRelation = async (idRelation, query) => {

    let enterprise = "";
    let name = "";
    let resourceType = "";
    let referenceCount = "";
    let measureUnit = "";
    query.filters.forEach(element => {
        switch (element.column.field) {
            case "enterprise":
                enterprise = element.value;
                break;
            case "name":
                name = element.value;
                break;
            case "idType":
                resourceType = element.value;
                break;
            case "referenceCount":
                referenceCount = element.value;
                break;
            case "measureUnit":
                measureUnit = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field === "idType" ? "resourceType" : query.orderBy.field : "";
    const response = await axios.api_v1.get('/resource_family_relation?idRelation=' + idRelation + '&enterprise=' + enterprise +
        '&name=' + name + '&resourceType=' + resourceType + '&referenceCount=' + referenceCount + '&measureUnit=' + measureUnit +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las familias de recursos que pertenecen a la relación.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const getResourceFamilyRelationList = async (idRelation, enterprise = "", name = "", resourceType = "", referenceCount = "", measureUnit = "") => {

    const response = await axios.api_v1.get('/resource_family_relation/list?idRelation=' + idRelation +
        '&enterprise=' + enterprise + '&name=' + name + '&resourceType=' + resourceType + '&referenceCount=' + referenceCount + '&measureUnit=' + measureUnit)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las familias de recursos que pertenecen a la relación.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {

        return response.data;
    }

}

export const updateResourceFamilyRelation = async (data) => {

    const response = await axios.api_v1.put('/resource_family_relation', data)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar editar la asociada entre la relación y familia de recursos.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const deleteResourceFamilyRelation = async (id) => {

    const response = await axios.api_v1.delete('/resource_family_relation/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar la asociada entre la relación y familia de recursos.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado la asociación entre la relación y familia de recursos correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar la asociación entre la relación y familia de recursos. La relación debe tener al menos una familia de recursos asociada.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar la asociación entre la relación y familia de recursos. Ha ocurrido un error en el servidor.");
    }

}