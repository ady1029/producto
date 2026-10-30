import axios from 'axios';

const header = () => {

    const { access_token } = sessionStorage.key(0) !== null ? JSON.parse(sessionStorage.getItem(sessionStorage.key(0))) : {};

    // if (process.env.NODE_ENV === 'development') {
    //     return {};
    // } else 
    if (access_token) {
        return {
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': true,
            // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Authorization': 'Bearer ' + access_token
        };
    } else {
        return {};
    }
}

export const api_v1 = axios.create({
    baseURL: process.env.PRODUCT_RESOURCE_API,
    headers: header()
});

export const mistral = axios.create({
    baseURL: process.env.MISTRAL_API,
    headers: header()
});

export const fuente_primaria = axios.create({
    baseURL: process.env.PRIMARY_SOURCE_API,
    headers: header()
});

export const is = axios.create({
    baseURL: process.env.OIDC_DISCOVERY
});

// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// instance.interceptors.request...

export default api_v1;