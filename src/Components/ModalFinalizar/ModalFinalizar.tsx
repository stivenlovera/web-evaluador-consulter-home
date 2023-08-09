import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'

interface PropModalFinalizar {
    openModal: boolean;
    message: string;
    onClose: (estado: boolean) => void;
}
const ModalFinalizar = ({ message, onClose, openModal }: PropModalFinalizar) => {
    return (
        <Dialog
            open={openModal}
            onClose={() => { onClose(false) }}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title" align='center'>
                Atencion
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='body1'>
                            {message}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ textTransform: "none" }}
                    fullWidth
                    variant="contained"
                    size='small'
                    type='submit'
                    color='primary'
                    onClick={() => { onClose(true) }}
                >
                    Si, finalizar
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    fullWidth
                    variant="contained"
                    size='small'
                    type='submit'
                    color='error'
                    onClick={() => { onClose(false) }}
                >
                    cancelar
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default ModalFinalizar
