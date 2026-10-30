import * as axios from './axios';


export const getAllProduct = async (idProductFamily, query) => {

    let ueb = "";
    let codigo = "";
    let name = "";
    let cup = "";
    let market = "";
    query.filters.forEach(element => {
        switch (element.column.field) {
            case "ueb":
                ueb = element.value;
                break;
            case "codigo":
                codigo = element.value;
                break;
            case "name":
                name = element.value;
                break;
            case "cup":
                cup = element.value;
                break;
            case "market":
                market = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field : "";
    const response = await axios.api_v1.get('/product?idProductFamily=' + idProductFamily + '&ueb=' + ueb + '&codigo=' + codigo +
        '&name=' + name + '&cup=' + cup + '&market=' + market +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los productos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const getAllProductList = async (idProductFamily) => {

    const response = await axios.api_v1.get('/product/list?idProductFamily=' + idProductFamily)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los productos.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}

export const updateProduct = async (data) => {

    const response = await axios.api_v1.put('/product', data)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar editar el producto.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}


export const deleteProduct = async (id) => {

    const response = await axios.api_v1.delete('/product/' + id)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar eliminar el producto.");
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        let result = await response.data.message;
        if (result === "successful")
            return "Se ha eliminado el producto correctamente.";
        else if (result === "restricted")
            throw new Error("No se puede eliminar el producto. Todas las familias tienen que tener asociado al menos un producto.");
        else if (result === "failed")
            throw new Error("No se ha podido eliminar el producto. Ha ocurrido un error en el servidor.");
    }


}