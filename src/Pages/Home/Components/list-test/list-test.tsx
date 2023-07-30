import { Box, Button, Grid, Paper, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { ITest } from '../../../../Services/Interface/ITest';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'initial',
    color: theme.palette.text.secondary,
}));
interface ListTestProps {
    tests: ITest[]
}
const ListTest = ({ tests }: ListTestProps) => {
    return (
        <>
            {tests.map((test, i) => {
                return (
                    <Item
                        key={i}
                        sx={{
                            mx: 'auto',
                        }}
                        style={{ background: '#f5f5f5', marginBottom: 10, }}
                        variant="outlined"
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }} >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" color="darkcyan">
                                        Nombre
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        {test.nombreTest}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" color="darkcyan">
                                        Tiempo para realizarlo
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        00:30:00
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" color="darkcyan">
                                        Disponible
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Hasta 08/05/2023
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Link to={'/evaluacion-PBL'}>
                                            <Button size='small' variant="contained" sx={{ textTransform: 'none' }}>Iniciar prueba</Button>
                                        </Link>
                                    </div>

                                </Grid>
                            </Grid>
                        </Box>
                    </Item>
                );
            })}

        </>
    )
}

export default ListTest
