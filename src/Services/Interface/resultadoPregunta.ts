import { IResultadoRespuesta } from "./resultadoRespuesta";

export interface IResultadoPreguntas {
    resultado_pregunta_id: number;
    resultado_test_id: number;
    pregunta_id: number;
    fecha_inicio: string;
    tiempo_duracion: number;
    resultadoRespuestas:IResultadoRespuesta[]
}