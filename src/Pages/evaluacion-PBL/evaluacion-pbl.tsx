import { Backdrop, Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, Grid, Typography } from '@mui/material'
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

export const initialStateResultado: IResultadoTest = {
    fecha_inicio: '',
    resultado_test_id: 0,
    test_id: 0,
    respuestaPreguntas: []
}
const EvaluacionPbl = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const { id, testId, evaluacion_id } = useParams();
    const [test, setTest] = useState<ITest>(initialStateTest);
    const myRefname = useRef<HTMLInputElement>(null);

    const { apiCreate, apiStore } = UseTest();

    const procesarData = (test: ITest) => {
        let initialStateResultado: IResultadoTest = {
            fecha_inicio: moment().format('YYYY-MM-DD HH:mm:ss'),
            respuestaPreguntas: [],
            resultado_test_id: test.resultado_test_id,
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
                    valor: respuesta.valor,
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
            if (data?.completado == 'si') {
                enqueueSnackbar('Test ya fue registrado', { variant: 'error' })
                //navigate('/home')
            }
            setTest(data!);
            procesarData(data!);
        } else {
            //navigate('/home')
        }
        setLoading(false);
    }
    useEffect(() => {
        Index();

        return () => {
        }
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
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2}>
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
                                                                            return (
                                                                                <Grid item xs={12} md={12} key={i}>
                                                                                    <Typography variant='subtitle1' >
                                                                                        {i + 1}.- {test.preguntas[i].pregunta_nombre}
                                                                                    </Typography>
                                                                                    {
                                                                                        test.preguntas[i].imagen != '' ? (
                                                                                            <CardMedia
                                                                                                style={{ maxWidth: '30%', margin: 'auto' }}
                                                                                                component="img"
                                                                                                image={test.preguntas[i].imagen == '' ? ImagenNoDisponible : test.preguntas[i].imagen}
                                                                                                alt="Paella dish"
                                                                                            />
                                                                                        )
                                                                                            : null
                                                                                    }
                                                                                    {
                                                                                        <Grid container spacing={2}>
                                                                                            <FieldArray
                                                                                                name="resultadoRespuestas"
                                                                                                render={arrayresultadoRespuestas => {
                                                                                                    const resultadoPregunta = values.respuestaPreguntas[i].resultadoRespuestas;
                                                                                                    return (
                                                                                                        <>
                                                                                                            {resultadoPregunta && resultadoPregunta.length > 0 ? (
                                                                                                                resultadoPregunta.map((paso: IResultadoRespuesta, index: number) => {
                                                                                                                    return (
                                                                                                                        <Grid item xs={12} md={12} key={index} >
                                                                                                                            <div >
                                                                                                                                <label style={{ display: 'flex' }} htmlFor={`image-resultado-${i}-${index}`}>
                                                                                                                                    <input
                                                                                                                                        ref={myRefname}
                                                                                                                                        type="file"
                                                                                                                                        accept="image/*"
                                                                                                                                        id={`image-resultado-${i}-${index}`}
                                                                                                                                        name={`resultadoRespuestas[${index}].imagen`}
                                                                                                                                        onChange={(e) => {
                                                                                                                                            onUploadImagen(e, i, index)
                                                                                                                                        }}
                                                                                                                                        hidden
                                                                                                                                    />
                                                                                                                                    <CardMedia
                                                                                                                                        style={{
                                                                                                                                            maxWidth: '50%',
                                                                                                                                            margin: 'auto'
                                                                                                                                        }}
                                                                                                                                        sx={{
                                                                                                                                            backgroundColor: 'white',
                                                                                                                                            '&:hover': {
                                                                                                                                                backgroundColor: '#94EFFF',
                                                                                                                                                opacity: [0.9, 0.8, 0.7],
                                                                                                                                            },
                                                                                                                                            cursor: 'pointer'
                                                                                                                                        }}
                                                                                                                                        component="img"
                                                                                                                                        image={values.respuestaPreguntas[i].resultadoRespuestas[index].descripcion == '' ? ImagenNoDisponible : values.respuestaPreguntas[i].resultadoRespuestas[index].descripcion}
                                                                                                                                        alt="Imagen"
                                                                                                                                    />
                                                                                                                                </label>
                                                                                                                            </div>
                                                                                                                            <div style={{ textAlign: 'center' }}>
                                                                                                                                <Button
                                                                                                                                    size='small'
                                                                                                                                    variant="contained"
                                                                                                                                    sx={{ textTransform: 'none', mt: 1 }}
                                                                                                                                    onClick={(e) => {
                                                                                                                                        myRefname.current?.click();
                                                                                                                                    }}
                                                                                                                                >
                                                                                                                                    {test.preguntas[i].respuestas[index].descripcion}
                                                                                                                                </Button>
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
                                                    type='submit'
                                                    color='success'
                                                    size='small'
                                                    variant="contained"
                                                    sx={{ textTransform: 'none', mt: 1 }}
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
            </Grid>
        </>
    )
}

export default EvaluacionPbl
