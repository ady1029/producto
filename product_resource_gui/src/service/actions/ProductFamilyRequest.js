import * as axios from './axios';


export const getAllProductFamily = async (query) => {

    let enterprise = "";
    let uebs = "";
    let name = "";
    let pharmaceuticShape = "";
    let format = "";
    let nationalDemand = "";
    query.filters.forEach(element => {
        switch (element.column.field) {
            case "enterprise":
                enterprise = element.value;
                break;
            case "uebs":
                uebs = element.value;
                break;
            case "name":
                name = element.value;
                break;
            case "pharmaceuticShape":
                pharmaceuticShape = element.value;
                break;
            case "format":
                format = element.value;
                break;
            case "nationalDemand":
                nationalDemand = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field : "";
    const response = await axios.api_v1.get('/product_family?enterprise=' + enterprise + '&uebs=' + uebs + '&name=' + name + '&pharmaceuticShape=' + pharmaceuticShape +
        '&format=' + format + '&nationalDemand=' + nationalDemand +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las familias de productos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const getProductFamilyList = async (idEnterprise) => {

    const response = await axios.api_v1.get('/product_family/list?idEnterprise=' + idEnterprise)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las familias de productos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {

        const result = await response.data;
        let productFamilyList = [];
        result.map((item) => {
            return productFamilyList.push({ id: item.id, name: item.name });
        });

        return productFamilyList;
    }

}

export const getProductFamily = async (id) => {

    const response = await axios.api_v1.get('/product_family/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener la familia de productos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const createProductFamily = async (data) => {

    const response = await axios.api_v1.post('/product_family', data)
        .catch(error => {
            throw error;
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }



}

export const updateProductFamily = async (data) => {

    const response = await axios.api_v1.put('/product_family', data)
        .catch(error => {
            throw error;
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}

export const deleteProductFamily = async (id) => {

    const response = await axios.api_v1.delete('/product_family/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar la familia de productos.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado la familia de productos correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar la familia de productos porque tiene relaciones asociadas.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar la familia de productos. Ha ocurrido un error en el servidor.");
    }

}