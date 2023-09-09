import { Backdrop, Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, FormControlLabel, Grid, Radio, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { ITest, initialStateTest } from '../../Services/Interface/ITest';
import { enqueueSnackbar } from 'notistack';
import ImagenNoDisponible from '../../assets/imagenes/no-disponible.png'
import * as Yup from "yup";
import { IResultadoTest } from '../../Services/Interface/resultadoTest';
import { FieldArray, Form, FormikProvider, useFormik } from 'formik';
import { readUploadedFileAsText } from '../../Utils/FileBase64';
import { IResultadoPreguntas } from '../../Services/Interface/resultadoPregunta';
import { IResultadoRespuesta } from '../../Services/Interface/resultadoRespuesta';
import moment from 'moment';
import UseTest from '../hooks/useTest';
import { useNavigate } from 'react-router-dom';
import ModalFinalizar from '../../Components/ModalFinalizar/ModalFinalizar';
import Timer from '../../Components/Timer/Timer';

export const initialStateResultado: IResultadoTest = {
    fecha_inicio: '',
    resultado_test_id: 0,
    test_id: 0,
    respuestaPreguntas: []
}
const EvaluacionFactorG = () => {
    const [transcurrido, setTranscurrido] = useState(0)
    const [iniciar, setIniciar] = useState(false);

    const navigate = useNavigate();
    const [modalFinalizar, setmodalFinalizar] = useState(false)
    const [loading, setLoading] = useState(true);
    const { id, testId, evaluacion_id } = useParams();
    const [test, setTest] = useState<ITest>(initialStateTest);
    const { apiCreate, apiStore } = UseTest();

    const procesarData = (test: ITest) => {
        let initialStateResultado: IResultadoTest = {
            fecha_inicio: moment().format('YYYY-MM-DD HH:mm:ss'),
            respuestaPreguntas: [],
            resultado_test_id: 0,
            test_id: test.test_id
        }

        test.preguntas.map((pregunta, i) => {
            let resultadoPregunta: IResultadoPreguntas = {
                fecha_inicio: moment().format('YYYY-MM-DD HH:mm:ss'),
                pregunta_id: pregunta.pregunta_id,
                resultado_pregunta_id: 0,
                resultado_test_id: 0,
                resultadoRespuestas: [],
                tiempo_duracion: 0
            }
            pregunta.respuestas.map((respuesta, index) => {
                let respuestaRespuesta: IResultadoRespuesta = {
                    descripcion: '',
                    respuesta_id: respuesta.respuesta_id,
                    resultado_pregunta_id: 0,
                    resultado_respuesta_id: 0,
                    valor: '0',
                    imagen: ''

                }
                resultadoPregunta.resultadoRespuestas.push(respuestaRespuesta);
            })
            initialStateResultado.respuestaPreguntas.push(resultadoPregunta);
        });
        setValues(initialStateResultado);
    }

    const Index = async () => {
        setLoading(true);
        const { data, status } = await apiCreate(parseInt(testId!), parseInt(id!), parseInt(evaluacion_id!));
        if (status) {
            const momentInicio = moment(data!.fecha_inicio)
            const momentSistema = moment(data!.fecha_sistema)
            const diferencia = momentInicio.diff(momentInicio, "second");
            const formatted = moment.utc(diferencia * 1000).format('HH:mm:ss');
            setTranscurrido(momentSistema.diff(momentInicio, "second"));

            console.log('seg trancurridos', diferencia)
            console.log('TIEMPO DE DIFERENCIA ', formatted)
            setIniciar(true)
            /* restart(new Date(formatted), true) */
            if (data?.completado == 'si') {
                enqueueSnackbar('Test ya fue registrado', { variant: 'error' })
                navigate('/home')
            }
            setTest(data!);
            procesarData(data!);
        } else {
            navigate('/home')
        }
        setLoading(false);
    }

    useEffect(() => {
        Index();
    }, [])

    const validationSchema = Yup.object().shape({
        resultado_test_id: Yup.number(),
        test_id: Yup.number(),
        fecha_inicio: Yup.string(),
        respuestaPreguntas: Yup.array().of(
            Yup.object().shape({
                resultado_pregunta_id: Yup.number(),
                resultado_test_id: Yup.number(),
                pregunta_id: Yup.number(),
                fecha_inicio: Yup.string(),
                tiempo_duracion: Yup.number(),
                resultadoRespuestas: Yup.array().of(
                    Yup.object().shape({
                        resultado_respuesta_id: Yup.number(),
                        resultado_pregunta_id: Yup.number(),
                        respuesta_id: Yup.number(),
                        decripcion: Yup.string(),
                        valor: Yup.string()
                    })
                )
            })
        ),
    });
    const formResultadosTest = useFormik({
        initialValues: initialStateResultado,
        validationSchema,
        onSubmit: async (values) => {
            console.log('enviar', values);
            await apiStore(values, parseInt(testId!), parseInt(id!));
            navigate('/home')
        }
    });
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        touched,
        setFieldValue,
        handleBlur,
        setValues,
        resetForm,
    } = formResultadosTest;

    const onUploadImagen = async (e: React.ChangeEvent<HTMLInputElement>, indexPregunta: number, indexRespuesta: number) => {
        const converImagen = await readUploadedFileAsText(e);
        console.log(converImagen)
        setFieldValue(`respuestaPreguntas[${indexRespuesta}].resultadoRespuestas[${indexRespuesta}].descripcion`, converImagen);
        console.log(values.respuestaPreguntas[indexPregunta].resultadoRespuestas[indexRespuesta].descripcion)
    }
    const seleccionUnica = (name: string, indexPregunta: number, valor: string) => {
        values.respuestaPreguntas[indexPregunta].resultadoRespuestas.map((respuesta: IResultadoRespuesta) => {
            return respuesta.valor = '0';
        });
        setValues(values);
        setFieldValue(name, '1');
    }

    const handlerFinalizar = async (estado: boolean) => {
        if (estado) {
            setLoading(true)
            await apiStore(values, parseInt(testId!), parseInt(id!));
            setLoading(false)
            navigate('/home')
        } else {
            setmodalFinalizar(false)
        }
    }
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Card variant="outlined">
                        <React.Fragment>
                            <CardContent>
                                <Timer
                                    expiryTimestamp={moment().add(transcurrido, 'second').toDate()}
                                    iniciar={iniciar}
                                    onExpire={() => { navigate('/home') }}
                                ></Timer>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box sx={{ minWidth: 275 }}>
                        <FormikProvider value={formResultadosTest}>
                            <Form onSubmit={(e) => { console.log(values); handleSubmit(e) }}>
                                <Card variant="outlined">
                                    <React.Fragment>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={12}>
                                                    <Typography variant='h6'>
                                                        {test.nombreTest}
                                                    </Typography>
                                                </Grid>
                                                <FieldArray
                                                    name="pasos"
                                                    render={arrayResultadoPreguntas => {
                                                        const resultadoPregunta = values.respuestaPreguntas;
                                                        return (
                                                            <>
                                                                {
                                                                    resultadoPregunta && resultadoPregunta.length > 0 ? (
                                                                        resultadoPregunta.map((paso: IResultadoPreguntas, i: number) => {
                                                                            const imagen = `${process.env.REACT_APP_API_PREGUNTA}${test.preguntas[i].imagen}` == ''
                                                                                ? ImagenNoDisponible
                                                                                : `${process.env.REACT_APP_API_PREGUNTA}${test.preguntas[i].imagen}`;

                                                                            return (
                                                                                <Grid item xs={12} md={12} key={i}>
                                                                                    <Typography variant='subtitle1' >
                                                                                        {i + 1}.- {test.preguntas[i].pregunta_nombre}
                                                                                    </Typography>
                                                                                    <br />
                                                                                    {
                                                                                        test.preguntas[i].imagen != '' ? (
                                                                                            <CardMedia
                                                                                                style={{ maxWidth: '80%', margin: 'auto' }}
                                                                                                component="img"
                                                                                                image={imagen}
                                                                                                alt="Paella dish"
                                                                                            />
                                                                                        )
                                                                                            : null
                                                                                    }
                                                                                    {
                                                                                        <Grid container spacing={2}>
                                                                                            <Grid item xs={12} md={12} >
                                                                                                <br />
                                                                                                <br />

                                                                                            </Grid>
                                                                                            <FieldArray
                                                                                                name="resultadoRespuestas"
                                                                                                render={arrayresultadoRespuestas => {
                                                                                                    const resultadoResultado = values.respuestaPreguntas[i].resultadoRespuestas;
                                                                                                    return (
                                                                                                        <>
                                                                                                            {resultadoResultado && resultadoResultado.length > 0 ? (
                                                                                                                resultadoResultado.map((respuesta: IResultadoRespuesta, index: number) => {
                                                                                                                    const imagenRespuesta = `${process.env.REACT_APP_API_RESPUESTA}${test.preguntas[i].respuestas[index].imagen}` == ''
                                                                                                                        ? ImagenNoDisponible
                                                                                                                        : `${process.env.REACT_APP_API_RESPUESTA}${test.preguntas[i].respuestas[index].imagen}`;
                                                                                                                    return (
                                                                                                                        <Grid item xs={2} md={2} key={index} style={{ paddingTop: 0 }} >
                                                                                                                            <div>
                                                                                                                                <CardMedia
                                                                                                                                    style={{ maxWidth: '80%', margin: 'auto' }}
                                                                                                                                    component="img"
                                                                                                                                    image={`${imagenRespuesta}`}
                                                                                                                                    alt=""
                                                                                                                                />
                                                                                                                                <FormControlLabel value="" control={
                                                                                                                                    <Radio
                                                                                                                                        checked={values.respuestaPreguntas[i].resultadoRespuestas[index].valor === '1'}
                                                                                                                                        onChange={() => { seleccionUnica(`respuestaPreguntas[${i}].resultadoRespuestas[${index}].valor`, i, test.preguntas[i].respuestas[index].valor) }}
                                                                                                                                        value={values.respuestaPreguntas[i].resultadoRespuestas[index].valor}
                                                                                                                                        name={`respuestaPreguntas[${i}].resultadoRespuestas[${index}].valor`}
                                                                                                                                        inputProps={{ 'aria-label': '1' }}
                                                                                                                                    />
                                                                                                                                } label={test.preguntas[i].respuestas[index].descripcion} />
                                                                                                                            </div>
                                                                                                                        </Grid>)
                                                                                                                })) : null}
                                                                                                        </>
                                                                                                    )
                                                                                                }}
                                                                                            />

                                                                                        </Grid>
                                                                                    }
                                                                                </Grid>
                                                                            )
                                                                        })
                                                                    ) : null
                                                                }
                                                            </>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Divider sx={{ m: 1 }}></Divider>
                                            <div style={{ textAlign: 'center' }}>
                                                <Button
                                                    color='success'
                                                    size='small'
                                                    variant="contained"
                                                    sx={{ textTransform: 'none', mt: 1 }}
                                                    onClick={() => {
                                                        setmodalFinalizar(true)
                                                    }}
                                                >
                                                    Finalizar Prueba
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </React.Fragment>
                                </Card>
                            </Form>
                        </FormikProvider>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ minWidth: 275 }}>
                        <Card variant="outlined">
                            <React.Fragment>
                                <CardContent>
                                    <Typography variant='subtitle1' style={{ fontWeight: 'bold' }} color={'darkred'} >
                                        {test.procedimiento}
                                    </Typography>
                                    {
                                        test.pasos.map((paso, i) => {
                                            return (
                                                <div key={i}>
                                                    <Typography variant="subtitle2" color="darkcyan">
                                                        {i + 1}.- {paso.descripcion}
                                                    </Typography>
                                                    {
                                                        paso.imagen != '' ?
                                                            (<CardMedia
                                                                component="img"
                                                                image={`${process.env.REACT_APP_API_PASOS}${paso.imagen}`}
                                                                alt={paso.descripcion}
                                                            />)
                                                            : null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </CardContent>
                            </React.Fragment>
                        </Card>
                    </Box>
                </Grid>
                <ModalFinalizar
                    message='Esta seguro de finalizar este Test?'
                    onClose={handlerFinalizar}
                    openModal={modalFinalizar}
                />
            </Grid>

        </>
    )
}

export default EvaluacionFactorG
