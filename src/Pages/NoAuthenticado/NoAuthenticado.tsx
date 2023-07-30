
import { Backdrop, Box, Button, Card, CircularProgress, Container, FormControl, FormHelperText, Grid, Input, InputLabel, Stack, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import UseRedirrect from './hooks/use-redirrect';
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png'
import { useFormik } from 'formik';
import * as Yup from 'yup';
const theme = createTheme();

interface IFormAuth {
  url: string;
}
const initialState: IFormAuth = {
  url: '',
}

const NoAuthenticado = () => {
  const [searchParams] = useSearchParams();
  const { onchangeVerificar } = UseRedirrect();
  const [loaderVerificar, setLoaderVerificar] = useState(false)
  const {
    isValid,
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    setErrors,
    setValues,
    resetForm,
    touched,
  } = useFormik({
    initialValues: initialState,
    onSubmit: async (value: IFormAuth) => {
      const url = value.url.split('?key=');
      if (url.length > 1) {
        console.log(url[1]);
        await onLoad(url[1]);
      } else {
        setErrors({ url: 'enlace no valido!' })
      }
    },
    validationSchema: Yup.object({
      url: Yup.string().required('Introdusca el enlace!'),
    })
  });


  const onLoad = async (url: string) => {
    await onchangeVerificar(url);
  }

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loaderVerificar}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <div
              style={{ textAlign: 'center', background: '#333' }}
            >
              <img
                src={logo}
                alt={'dadad'}
                loading="lazy"
              />
            </div>
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              ConsultersHome
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Bienvenido, para acceder copia el enlace y preciona en el boton verificar.
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <TextField
                  id='url'
                  fullWidth
                  name='url'
                  variant='standard'
                  label='Enlace'
                  value={values.url}
                  placeholder="Introdusca enlace"
                  onChange={handleChange}
                  error={Boolean(touched.url && errors.url)}
                  helperText={touched.url && errors.url}
                />
                <Button size='medium' type='submit' variant="contained">Verificar</Button>
              </Stack>
            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  )
}

export default NoAuthenticado
