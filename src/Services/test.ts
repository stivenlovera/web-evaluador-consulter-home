import axios from "axios";
import { AxiosRequest } from "../Utils/Axios";
import { IResponse } from "./Interface/IResponse";
import { ITest } from "./Interface/ITest";
import { IResultadoTest } from "./Interface/resultadoTest";
AxiosRequest();
export async function TestCreateService(testId: number, postulante: number) {
    return await axios.get<IResponse<ITest>>(`${process.env.REACT_APP_API_CONSULTER_HOME}/api/test-resultado/create/${testId}/${postulante}`);
}
export async function TestStoreService(values:IResultadoTest,testId: number, postulante: number) {
    return await axios.post<IResponse<ITest>>(`${process.env.REACT_APP_API_CONSULTER_HOME}/api/test-resultado/${testId}/${postulante}`,values);
}
