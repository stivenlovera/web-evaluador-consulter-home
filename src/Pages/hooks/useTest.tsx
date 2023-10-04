import { enqueueSnackbar } from "notistack";
import { TestCreateService, TestEjemploService, TestStoreService } from "../../Services/test";
import { IResultadoTest } from "../../Services/Interface/resultadoTest";

const UseTest = () => {
    const apiEjemplo = async (testId: number, postulanteId: number, evaluacion_id: number) => {
        try {
            const { data } = await TestEjemploService(testId, postulanteId, evaluacion_id);
            if (data.status == 1) {
                return {
                    status: !!data.status,
                    data: data.data
                };
            } else {
                enqueueSnackbar(data.message, { variant: 'error' });
                return {
                    status: !!data.status,
                    data: null
                };
            }
        } catch (error) {
            enqueueSnackbar('Ocurio un error', { variant: 'error' });
            return {
                status: false,
                data: null
            };
        }
    }
    const apiCreate = async (testId: number, postulanteId: number, evaluacion_id: number) => {
        try {
            const { data } = await TestCreateService(testId, postulanteId, evaluacion_id);
            if (data.status == 1) {
                return {
                    status: !!data.status,
                    data: data.data
                };
            } else {
                enqueueSnackbar(data.message, { variant: 'error' });
                return {
                    status: !!data.status,
                    data: null
                };
            }
        } catch (error) {
            enqueueSnackbar('Ocurio un error', { variant: 'error' });
            return {
                status: false,
                data: null
            };
        }
    }
    const apiStore = async (values: IResultadoTest, testId: number, postulanteId: number) => {
        try {
            const { data } = await TestStoreService(values, testId, postulanteId);
            if (data.status == 1) {
                enqueueSnackbar(data.message, { variant: 'success' });
                return {
                    status: !!data.status,
                    data: data.data
                };
            } else {
                enqueueSnackbar(data.message, { variant: 'error' });
                return {
                    status: !!data.status,
                    data: null
                };
            }
        } catch (error) {
            enqueueSnackbar('Ocurio un error', { variant: 'error' });
            return {
                status: false,
                data: null
            };
        }
    }
    return {
        apiCreate,
        apiEjemplo,
        apiStore
    }
}
export default UseTest;