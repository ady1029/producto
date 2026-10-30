import * as axios from './axios';


export const getAllMeasureUnit = async () => {

    const response = await axios.api_v1.get('/measure_unit')
        .catch(error => {
            throw new Error("Ha ocurrido un error al intentar obtener las unidades de medidas.");
        });

    if (response.status !== 200) {
        throw new Error("Error de la api ");
    } else {


        let muList = [];
        // let muObject = {};
        response.data.forEach(item => {
            // muObject[item.id] = item.name;
            muList.push({ id: item.name, name: item.name })
        });


        return muList;
    }

}