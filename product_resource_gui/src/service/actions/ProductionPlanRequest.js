import * as axios from './axios';


export const getAllProductionPlan = async (query) => {

    let enterprise = "";
    let name = "";
    let planThisYear = "";
    let planNextYear = "";
    query.filters.forEach(element => {
        switch (element.column.field) {
            case "enterprise":
                enterprise = element.value;
                break;
            case "name":
                name = element.value;
                break;
            case "planThisYear":
                planThisYear = element.value;
                break;
            case "planNextYear":
                planNextYear = element.value;
                break;
            default:
                break;
        }
    });

    let sortBy = query.orderBy !== undefined ? query.orderBy.field : "";
    const response = await axios.api_v1.get('/production_plan?enterprise=' + enterprise + '&name=' + name + '&planThisYear=' + planThisYear +
        '&planNextYear=' + planNextYear +
        '&page=' + query.page + '&pageSize=' + query.pageSize + '&sortBy=' + sortBy + '&sort=' + query.orderDirection)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener los planes de producción.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return response.data;
    }

}


export const updateProductionPlan = async (data) => {

    const response = await axios.api_v1.put('/production_plan', data)
        .catch(error => {
            throw error;
        });


    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {
        return true;
    }

}