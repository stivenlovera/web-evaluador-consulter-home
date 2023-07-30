import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import moment from 'moment';
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es');
interface InformacionPersonalProps {
    nombre: string;
    apellidos: string;
    cargo: string;
    fechaFinal: string;
}
const InformacionPersonal = ({ apellidos, nombre, cargo, fechaFinal }: InformacionPersonalProps) => {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {moment().format('dddd DD MMMM yyyy')}
                    </Typography>
                    <Typography variant="h5" component="div">
                        Bienvenido, {nombre}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Postulando para cargo: {cargo.toUpperCase()}
                    </Typography>
                    <Typography variant="body2">
                        Limite de entrega {moment(fechaFinal).format('DD MMMM yyyy')}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}

export default InformacionPersonal