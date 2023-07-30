export interface IPregunta {
    pregunta_id: number;
    pregunta_nombre: string;
    imagen: string;
    respuestas: IRespuesta[]
    tiempo_total:number
}
export interface IRespuesta {
    respuesta_id: number;
    imagen: string;
    descripcion:string;
    procesar:string;
    valor:string;
}