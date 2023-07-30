import axios from "axios";
import { IEvaluacion } from "./Interface/evaluacion";

export async function EvaluacionService() {
    return await axios.get<IEvaluacion>(`${process.env.REACT_APP_API_COMISIONES}api/evaluacion`);
}