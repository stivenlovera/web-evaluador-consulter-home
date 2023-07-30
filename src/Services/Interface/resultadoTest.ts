import { IResultadoPreguntas } from "./resultadoPregunta";

export interface IResultadoTest {
    resultado_test_id: number;
    test_id: number;
    fecha_inicio: string;
    respuestaPreguntas: IResultadoPreguntas[]
}