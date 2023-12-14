import { Backdrop, Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, TextField, Typography } from '@mui/material'
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
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const initialStateResultado: IResultadoTest = {
    fecha_inicio: '',
    resultado_test_id: 0,
    test_id: 0,
    respuestaPreguntas: []
}
const EvaluacionRoshard = () => {
    const navigate = useNavigate();
    const [modalFinalizar, setmodalFinalizar] = useState(false)
    const [loading, setLoading] = useState(true);
    const { id, testId, evaluacion_id } = useParams();
    const [test, setTest] = useState<ITest>(initialStateTest);


    const { apiCreate, apiStore } = UseTest();

    const procesarData = (test: ITest) => {
        console.log(test)
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
                resultado_test_id: test.resultado_test_id, //test.resultado_test_id add
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
            await handlerFinalizar()
            /* await apiStore(values, parseInt(testId!), parseInt(id!));
            navigate('/home') */
        }
    });

    const handlerFinalizar = async () => {
        if (isValid) {
            console.log(values)
            setLoading(true)
            const { data, status } = await apiStore(values, parseInt(testId!), parseInt(id!));
            if (status) {
                setLoading(false)
                setmodalFinalizar(false)
                navigate('/home')
            }
        }
        else {

        }
    }

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
        isValid
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
                            <Form onSubmit={(e) => { console.log(values); /* handleSubmit(e) */ }}>
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
                                                                                    {
                                                                                        test.preguntas[i].imagen != '' ? (
                                                                                            <Grid container spacing={0} key={i} justifyContent={'center'} alignContent={'center'} display={'flex'}>
                                                                                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                                                                                    <CardMedia
                                                                                                        style={{ maxWidth: '100%', margin: 'auto' }}
                                                                                                        component="img"
                                                                                                        image={`${imagen}`}
                                                                                                        alt=""
                                                                                                    />
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        )
                                                                                            : null
                                                                                    }
                                                                                    {
                                                                                        <Grid container spacing={2} style={{ marginTop: 5 }}>
                                                                                            <FieldArray
                                                                                                name="resultadoRespuestas"
                                                                                                render={arrayresultadoRespuestas => {
                                                                                                    const resultadoResultado = values.respuestaPreguntas[i].resultadoRespuestas;
                                                                                                    return (
                                                                                                        <>
                                                                                                            {resultadoResultado && resultadoResultado.length > 0 ? (
                                                                                                                resultadoResultado.map((respuesta: IResultadoRespuesta, index: number) => {

                                                                                                                    return (
                                                                                                                        <Grid item xs={12} md={12} key={index} >
                                                                                                                            {
                                                                                                                                index == 0 ? (<TextField
                                                                                                                                    fullWidth
                                                                                                                                    label={test.preguntas[i].respuestas[index].descripcion}
                                                                                                                                    variant="filled"
                                                                                                                                    size='small'
                                                                                                                                    name={`respuestaPreguntas[${i}].resultadoRespuestas[${index}].descripcion`}
                                                                                                                                    value={values.respuestaPreguntas[i].resultadoRespuestas[index].descripcion}
                                                                                                                                    onChange={handleChange}
                                                                                                                                    onBlur={handleBlur}
                                                                                                                                />) : null
                                                                                                                            }
                                                                                                                            {
                                                                                                                                index == 1 ? (
                                                                                                                                    <Marcacion
                                                                                                                                        onPosicion={(valor) => { console.log(valor); setFieldValue(`respuestaPreguntas[${i}].resultadoRespuestas[${index}].descripcion`, valor) }}
                                                                                                                                        posiciones={values.respuestaPreguntas[i].resultadoRespuestas[index].descripcion}
                                                                                                                                    />
                                                                                                                                ) : null
                                                                                                                            }
                                                                                                                            {
                                                                                                                                index == 2 ? (
                                                                                                                                    <SeleccionOpcion
                                                                                                                                        name={`respuestaPreguntas[${i}].resultadoRespuestas[${index}].descripcion`}
                                                                                                                                        setFieldValue={setFieldValue}
                                                                                                                                        key={index}
                                                                                                                                    />
                                                                                                                                ) : null
                                                                                                                            }
                                                                                                                        </Grid>)
                                                                                                                })) : null}
                                                                                                        </>
                                                                                                    )
                                                                                                }}
                                                                                            />

                                                                                        </Grid>
                                                                                    }
                                                                                </Grid >
                                                                            )
                                                                        })
                                                                    ) : null
                                                                }
                                                            </>
                                                        )
                                                    }}
                                                />
                                            </Grid >
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
            </Grid >
            <ModalFinalizar
                message='Esta seguro de finalizar este Test?'
                onClose={(estado) => {
                    if (estado) {
                        handlerFinalizar()
                    } else {
                        setmodalFinalizar(false)
                    }
                }}
                openModal={modalFinalizar}
            />
        </>
    )
}

export default EvaluacionRoshard;
interface MarcacionPros {
    onPosicion: (posicion: string) => void;
    posiciones: string;
}
interface Imagen {
    posicion: number,
    valor: boolean
}
const initialImagen: Imagen[] = [
    {
        posicion: 1,
        valor: false
    },
    {
        posicion: 2,
        valor: false
    },
    {
        posicion: 3,
        valor: false
    },
    {
        posicion: 4,
        valor: false
    },
    {
        posicion: 5,
        valor: false
    },
    {
        posicion: 6,
        valor: false
    },
    {
        posicion: 7,
        valor: false
    },
    {
        posicion: 8,
        valor: false
    },
    {
        posicion: 9,
        valor: false
    }
];
const Marcacion = ({ onPosicion, posiciones }: MarcacionPros) => {
    const [imagen, setImagen] = useState<Imagen[]>(initialImagen);
    useEffect(() => {
    }, [imagen])

    return (
        <Grid container spacing={0} justifyContent={'center'} alignContent={'center'} display={'flex'}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Typography align='center'>
                    Seleccione donde lo ve
                </Typography>
            </Grid>
            <Grid item xl={6} lg={6} md={8} sm={12} xs={12}>
                <Grid container spacing={0} justifyContent={'center'} alignContent={'center'} display={'flex'}>
                    {
                        imagen.map((img, i) => {
                            return (
                                <Grid item xl={4} lg={4} md={4} sm={4} xs={4} key={i}>
                                    <Paper
                                        sx={{
                                            height: 100,
                                            width: 'auto',
                                            background: imagen[i].valor ? '#E8E8E8' : '#FFFFFF'
                                        }}
                                        onClick={() => {
                                            imagen[i].valor = !imagen[i].valor;
                                            setImagen(imagen);
                                            const resultado = imagen.filter((ele, index) => {
                                                return ele.valor == true
                                            });
                                            onPosicion((resultado.map(e => e.posicion)).toString())
                                        }}
                                    />
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}
interface SeleccionOpcionProps {
    name: string;
    setFieldValue: (name: string, valor: string) => void;
}
const SeleccionOpcion = ({ name, setFieldValue }: SeleccionOpcionProps) => {
    const [seleccion, setSeleccion] = React.useState('');
    return (
        <FormControl fullWidth size='small'>
            <InputLabel id="demo-simple-select-label">Seleccione por que lo ve</InputLabel>
            <Select
                value={seleccion}
                label="Seleccione por que lo ve"
                onChange={(event) => {
                    event.target.value as string
                    setFieldValue(name, event.target.value as string)
                    setSeleccion(event.target.value as string);
                }}
            >
                <MenuItem value={'Por su forma'}>Por su forma</MenuItem>
                <MenuItem value={'Por su color'}>Por su color</MenuItem>
                <MenuItem value={'Por la perspectiva'}>Por la perspectiva</MenuItem>
                <MenuItem value={'Por su textura'}>Por su textura</MenuItem>
                <MenuItem value={'Por su color y forma'}>Por su color y forma</MenuItem>
                <MenuItem value={'Por su forma y color'}>Por su forma y color</MenuItem>
            </Select>
        </FormControl>
    )
}
