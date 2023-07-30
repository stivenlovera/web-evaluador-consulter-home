import axios from "axios";
import { AxiosRequest } from "../Utils/Axios";
import { IAuthenticacion } from "./Interface/authenticacion";
import { IResponse } from "./Interface/IResponse";
AxiosRequest();
export async function AuthenticacionService() {
    return await axios.get<IResponse<IAuthenticacion>>(`${process.env.REACT_APP_API_CONSULTER_HOME}/api/auth-evaluador`, );
}
export async function VerificarAuthenticacionService() {
    return await axios.get<IResponse<IAuthenticacion>>(`${process.env.REACT_APP_API_CONSULTER_HOME}/api/auth-evaluador`);
}