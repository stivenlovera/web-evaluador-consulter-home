import axios from "axios";
import { AxiosRequest } from "../Utils/Axios";
import { IInformacion } from "./Interface/IHome";
import { IResponse } from "./Interface/IResponse";
AxiosRequest();
export async function HomeService() {
    return await axios.get<IResponse<IInformacion>>(`${process.env.REACT_APP_API_CONSULTER_HOME}/api/evaluador`);
}