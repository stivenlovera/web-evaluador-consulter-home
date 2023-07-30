import { ITest } from "./ITest";

export interface IHome {
    status: number;
    message: string;
    data: IInformacion
}
export interface IInformacion {
    id: number;
    test: ITest[],
    nombreCompleto: string;
    cargo: string;
    fechaFinal: string;
    fechaInicio: string;
}
