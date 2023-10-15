import { IPregunta } from "./IPregunta";

export interface ITest {
    test_id: number;
    completado: string;
    nombreTest: string;
    tipo_preguntas_id: number;
    descripcion_test: string;
    fecha_inicio: string;
    seg_disponibles: number;
    tiempo_total: number;
    preguntas: IPregunta[];
    procedimiento: ''
    pasos: IProcedimiento[]
    resultado_test_id:number;
}
export interface IProcedimiento {
    procedimiento_id: number;
    descripcion: string;
    imagen: string;
}
export const initialStateTest: ITest = {
    nombreTest: '',
    completado: '',
    test_id: 0,
    tiempo_total: 0,
    tipo_preguntas_id: 0,
    descripcion_test: '',
    pasos: [],
    preguntas: [],
    procedimiento: '',
    fecha_inicio: '',
    seg_disponibles: 0,
    resultado_test_id:0
}