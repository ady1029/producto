import * as axios from './axios';


export const getEnterprises = async () => {

    const response = await axios.fuente_primaria.get('/entidad')
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las empresas. Verifique su conexión.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    }

    const result = await response.data;
    let enterpriseList = [];
    result.map((item) => {
        return enterpriseList.push({ id: item.id, name: item.nombre });
    });

    return enterpriseList;

}

export const getUEBs = async (idEnterprise) => {

    const response = await axios.fuente_primaria.get('/laboratorios?entidad=' + idEnterprise)
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las UEB. Verifique su conexión.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    }

    const result = await response.data;
    let uebList = [];
    result.map((item) => {
        return uebList.push({ id: item.codigo, name: item.nombre, idEnterprise: idEnterprise });
    });

    return uebList;

}


export const getSources = async (idEnterprise, codUeb) => {

    const response = await axios.fuente_primaria.get('/listar?empresa=' + idEnterprise + '&ueb=' + codUeb + '&fuentePrimaria=1')
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las fuentes. Verifique su conexión.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    }

    const result = await response.data;
    let uebList = [];
    result.map((item) => {
        return uebList.push({ id: item.fuente_primaria, name: item.fuente_primaria });
    });

    return uebList;

}