import { Backdrop, CircularProgress, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Route, Router, Link, NavLink, Routes, Navigate, useSearchParams } from 'react-router-dom';
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { ProtectorRoute } from './components/ProtectorRoute';
import { NoProtectorRoute } from './components/NoProtectorRoute';
import { SelectToken, setToken } from '../Reducers/Slices/LoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import UseRedirrect from '../Pages/NoAuthenticado/hooks/use-redirrect';
import { VerificarAuthenticacionService } from '../Services/authenticacion';
const mdTheme = createTheme(
    {
        components: {
            /* MuiTimeline: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'red',
                    },
                },
            }, */
        },
    }
);

const Home = lazy(() => import('../Pages/Home/Home'));
const Authenticador = lazy(() => import('../Pages/Authenticacion/Authenticador'));
const NoAuthenticado = lazy(() => import('../Pages/NoAuthenticado/NoAuthenticado'));
const EvalucionPBL = lazy(() => import('../Pages/evaluacion-PBL/evaluacion-pbl'));
const EvalucionCRT = lazy(() => import('../Pages/evaluacion-PBL/evaluacion-crt'));
const EvaluacionRespUnica = lazy(() => import('../Pages/evaluacion-PBL/evaluacion-respuesta-unica'));
const EvaluacionResKuden = lazy(() => import('../Pages/evaluacion-PBL/evaluacion-kuden'));

const RouteApp = () => {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [spinner, setSpinner] = useState(true);
    const token = useSelector(SelectToken);

    const { authenticacion, setAuthenticacion, onchangeVerificar } = UseRedirrect();

    const onLoad = async (url: string) => {
        await onchangeVerificar(url);
    }

    const dispatch = useDispatch();
    const updateToken = (token: boolean) => {
        dispatch(
            setToken({
                token: token
            })
        )
    }

    const getAuth = async () => {
        try {
            const { data } = await VerificarAuthenticacionService();
            if (data.status == 1) {
                setAuthenticacion(data.data);
            }
            else {
                updateToken(false);
            }
        } catch (error) {
            updateToken(false);
        }
    };
    useEffect(() => {
        if (!token) {
            const url = searchParams.get('key');
            if (url != null) {
                onLoad(url);
            }
            return;
        } else {
            getAuth();

            return;

        }
    }, [token])

    return (
        <Suspense fallback={<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={spinner}>
            <CircularProgress color="inherit" />
        </Backdrop>}>
            <ThemeProvider theme={mdTheme}>
                <Routes>
                    <Route element={<ProtectorRoute valid={token} children redirrecTo={'/Authenticador'} nombreCompleto={authenticacion.nombreCompleto} perfil={'no-foto.jpg'} />}>
                        <Route path="/home" element={<Home />}></Route>
                        <Route path="/evaluacion-PBL/:testId/:id" element={<EvalucionPBL />}></Route>
                        <Route path="/evaluacion-CRT/:testId/:id" element={<EvalucionCRT />}></Route>
                        <Route path="/evaluacion-unica/:testId/:id" element={<EvaluacionRespUnica />}></Route>
                        <Route path="/evaluacion-kuden/:testId/:id" element={<EvaluacionResKuden />}></Route>
                        
                    </Route>
                    <Route path='/Authenticador' element={
                        <NoProtectorRoute valid={token} redirrecTo={'/inicio'}>
                            <NoAuthenticado />
                        </NoProtectorRoute>}>
                        <Route path="/Authenticador" element={<NoAuthenticado />}></Route>
                    </Route>
                    {/* <Route path="/en-mantenimiento" element={<EnMantenimiento />}></Route> */}
                    {/* <Route path="/" element={<Login />}></Route>
                        <Route path="/Error" element={<Error404 />}></Route> */}
                    {/* redirrect */}
                    <Route path='/*' element={<Navigate to="/home" replace />}>
                    </Route>
                </Routes>
            </ThemeProvider>
        </Suspense>
    )
}

export default RouteApp
