// https://example.com/products?page=10

import { VariantType, useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticacionService } from "../../../Services/authenticacion";
import { useDispatch } from "react-redux";
import { setToken } from "../../../Reducers/Slices/LoginSlice";
import { IAuthenticacion } from "../../../Services/Interface/authenticacion";

const UseRedirrect = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const updateToken = (token: string) => {
        dispatch(
            setToken({
                token: token
            })
        )
    }
    const [authenticacion, setAuthenticacion] = useState<IAuthenticacion>({
        modulos:[],
        nombreCompleto:'',
        perfil:''
    })
    const onchangeVerificar = async (verificar: string) => {
        updateToken(verificar);
        try {
            const { data } = await AuthenticacionService();
            console.log('response authenticate',data)
            if (data.status == 1) {
                setAuthenticacion(data.data)
               
                enqueueSnackbar('Enlace valido, Bienvenido', { variant: 'success' });
            } else {
                enqueueSnackbar(data.message, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Enlace no valido', { variant: 'error' });
        }
    }
    return {
        authenticacion,
        setAuthenticacion,
        onchangeVerificar
    }
}
export default UseRedirrect;