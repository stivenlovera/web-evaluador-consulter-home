import { IPregunta } from "./IPregunta";

export interface ITest {
    test_id: number;
    completado: string;
    activarTiempo: boolean;
    tiempoTranscurrido: number;
    nombreTest: string;
    tipo_preguntas_id: number;
    descripcion_test: string;
    fecha_inicio: string;
    fecha_sistema: string;
    tiempo_total: number;
    preguntas: IPregunta[];
    procedimiento: string;
    pasos: IProcedimiento[];
    resultado_test_id: number;
    ejemplo_test_id: number;
}
export interface IProcedimiento {
    procedimiento_id: number;
    descripcion: string;
    imagen: string;
}
export const initialStateTest: ITest = {
    nombreTest: '',
    completado: '',
    activarTiempo: false,
    tiempoTranscurrido: 0,
    test_id: 0,
    tiempo_total: 0,
    tipo_preguntas_id: 0,
    descripcion_test: '',
    pasos: [],
    preguntas: [],
    procedimiento: '',
    fecha_inicio: '',
    fecha_sistema: '',
    resultado_test_id: 0,
    ejemplo_test_id: 0
}