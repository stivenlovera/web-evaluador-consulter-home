import { enqueueSnackbar } from "notistack";
import { useContext, useState } from "react";
import { HomeService } from "../../../Services/home";
import {  IInformacion } from "../../../Services/Interface/IHome";

export const UseHome = () => {
    const [informacion, setInformacion] = useState<IInformacion>({
        id:0,
        cargo: '',
        nombreCompleto: '',
        test: [],
        fechaFinal: '',
        fechaInicio: ''
    });

    const apiLisTest = async () => {
        try {
            const { data } = await HomeService();
            if (data.status == 1) {
                setInformacion(data.data)
                return !!data.status;
                
            } else {
                enqueueSnackbar(data.message, { variant: 'error' });
                return !!data.status;
            }
        } catch (error) {
            enqueueSnackbar('Ocurio un error', { variant: 'error' });
            return false;
        }
    }
    return {
        informacion,
        setInformacion,
        apiLisTest
    }
}