import AXIOS from "axios";
const asyncLocalStorage = {
    setItem: async function (key: any, value: any) {
        await null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key: any) {
        await null;
        return localStorage.getItem(key);
    }
};

export interface AxiosResponseProps {
    status: number;
    statusText: string;
}
export const AxiosResponse = () => {
    AXIOS.interceptors.response.use(
        async (config) => {
            //console.log(config.headers.authorization);
            asyncLocalStorage.setItem('token', config.headers.authorization);
            //console.log('Response',(config.status))
            return config;
        }
    );
}

export const AxiosRequest = async () => {
    AXIOS.interceptors.request.use(
        async (config: any) => {
            config.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await asyncLocalStorage.getItem('token')}`
            };
            return config;
        }
    );
}
