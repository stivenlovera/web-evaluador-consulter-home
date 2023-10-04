import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, CircularProgress, Grid, IconButton, ListItem, ListItemButton, Stack, Typography } from "@mui/material";
import InformacionPersonal from './Components/informacion-personal/informacion-personal';
import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectToken } from '../../Reducers/Slices/LoginSlice';
import { UseHome } from './hooks/useHome';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';
import ModalIniciar from '../../Components/ModalIniciar/modal-iniciar';
import moment from 'moment';

interface TipoEvaluacion {
  id: number;
  nombreRouter: string;
}

const Home = () => {
  const [modalIniciar, setmodalIniciar] = useState(false)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { apiLisTest, informacion } = UseHome();
  const [iniciarTest, setIniciarTest] = useState({
    url: '',
    message: ''
  })

  const token = useSelector(SelectToken);

  const LoadTest = async () => {
    if (await apiLisTest()) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  const resolverUrl = (tipo_preguntas_id: number, test_id: number, id: number, evaluacion_id: number): string => {
    let route: string = '';
    console.log('Data entrante..', tipo_preguntas_id)
    switch (tipo_preguntas_id) {
      case 1:
        route = `/evaluacion-CRT/${test_id}/${id}/${evaluacion_id}`;
        break
      case 2:
        route = `/evaluacion-unica/${test_id}/${id}/${evaluacion_id}`;
        break
      case 3:
        route = `/evaluacion-unica/${test_id}/${id}/${evaluacion_id}`;
        break
      case 4:
        route = `/evaluacion-PBL/${test_id}/${id}/${evaluacion_id}`;
        break;
      case 7:
        route = `/evaluacion-kuden/${test_id}/${id}/${evaluacion_id}`;
        break;
      case 11:
        route = `/evaluacion-factor-g/${test_id}/${id}/${evaluacion_id}`;
        break;
      case 12:
        route = `/evaluacion-colores/${test_id}/${id}/${evaluacion_id}`;
        break;
      default:
        route = `/evaluacion-unica/${test_id}/${id}/${evaluacion_id}`;
    }
    return route;
  }
  const resolverEjemploUrl = (tipo_preguntas_id: number, test_id: number, id: number, evaluacion_id: number): string => {
    let route: string = '';
    switch (tipo_preguntas_id) {
      case 11:
        route = `/evaluacion-factor-g-ejemplo/${test_id}/${id}/${evaluacion_id}`;
        break;
      default:
        route = `#`;
    }
    return route;
  }
  useEffect(() => {
    LoadTest();
  }, [token])

  const handlerIniciar = (valor: boolean) => {
    if (valor) {
      navigate(iniciarTest.url)
      setmodalIniciar(false);
    }
    else {
      setmodalIniciar(false);
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
          <InformacionPersonal
            apellidos={informacion.nombreCompleto}
            cargo={informacion.cargo}
            nombre={informacion.nombreCompleto}
            fechaFinal={informacion.fechaFinal}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Card sx={{ minWidth: 275 }} >
            <CardContent>
              <Typography variant='body1' style={{ fontWeight: 'bold' }} color={'darkred'} >
                Pendientes
              </Typography>
              {
                informacion.test.map((test, i) => {
                  return test.completado == 'no' ? (
                    <ListItemButton
                      key={i}
                    >
                      <div style={{ border: '1px solid #22A9DF', padding: 10, margin: 10, width: '100%' }}>
                        <Box sx={{ justifyContent: 'space-between', display: "flex", flexWrap: "wrap" }}>
                          <Typography sx={{ flexGrow: 1 }} style={{ margin: 3 }} variant='subtitle1' gutterBottom align='left'>
                            {test.nombreTest}
                          </Typography>
                          {
                            test.tiempo_total == 0 ? (null) : (<Chip label={`Duracion ${test.completado == 'no' ? (moment.utc(test.tiempo_total * 1000).format('HH:mm:ss')) : null}`} color="primary" style={{ margin: 3 }} />)
                          }
                          {
                            test.ejemplo_test_id != 0 ? (
                              <Chip
                                label={'Ver explicacion'}
                                color="default"
                                style={{ margin: 3 }}
                                icon={<PlayArrowIcon />}
                                onClick={() => {
                                  navigate(resolverEjemploUrl(test.tipo_preguntas_id, test.ejemplo_test_id, informacion.id, informacion.evaluacion_id))
                                  //console.log(resolverEjemploUrl(test.tipo_preguntas_id, test.ejemplo_test_id, informacion.id, informacion.evaluacion_id))
                                }} />
                            ) : null
                          }
                          <Chip
                            label={'INICIAR'}
                            color="success"
                            style={{ margin: 3 }}
                            icon={<PlayArrowIcon />}
                            onClick={() => {
                              setmodalIniciar(true)
                              //verificar tiempo
                              let message = '';
                              if (test.tiempo_total == 0) {
                                message = `Esta seguro de iniciar este test?`
                              } else {
                                message = `Esta seguro de iniciar este test?, tiene un tiempo de ${test.completado == 'no' ? (moment.utc(test.tiempo_total * 1000).format('HH:mm:ss')) : null}`
                              }
                              setIniciarTest({
                                url: resolverUrl(test.tipo_preguntas_id, test.test_id, informacion.id, informacion.evaluacion_id),
                                message: message
                              })
                            }}
                          />
                        </Box>
                      </div>
                    </ListItemButton>
                  ) : null
                })
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card >
            <CardContent>
              <Typography variant='body1' style={{ fontWeight: 'bold' }} color={'darkred'} >
                Completados
              </Typography>
              {
                informacion.test.map((test, i) => {
                  return test.completado == 'si' ? (
                    <ListItemButton
                      key={i}
                    >
                      <div style={{ border: '1px solid #22A9DF', padding: 10, margin: 10, width: '100%' }}>
                        <Box sx={{ justifyContent: 'space-between', display: "flex", flexWrap: "wrap" }}>
                          <Typography sx={{ flexGrow: 1 }} style={{ margin: 3 }} variant='subtitle1' gutterBottom align='left'>
                            {test.nombreTest}
                          </Typography>
                          {/*  {
                            test.tiempo_total == 0 ? (null) : (<Chip label={`Duracion ${test.completado == 'si' ? (moment.utc(test.tiempo_total * 1000).format('HH:mm:ss')) : ''}`} color="primary" style={{ margin: 3 }} />)
                          } */}
                        </Box>
                      </div>
                    </ListItemButton>
                  ) : null
                })
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid >
      <ModalIniciar
        message={iniciarTest.message}
        onClose={handlerIniciar}
        openModal={modalIniciar}
      />
    </>
  )
}

export default Home;
