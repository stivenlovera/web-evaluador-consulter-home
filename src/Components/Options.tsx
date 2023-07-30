import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AxiosError } from "axios";
import { setToken } from "../Reducers/Slices/LoginSlice";

interface OptionProps {
    perfil: string;
    nombreCompleto:string;
}

const Option = ({ perfil,nombreCompleto }: OptionProps) => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const nagivate = useNavigate();

    const dispatch = useDispatch();
    const updateToken = (token: boolean) => {
        dispatch(
            setToken({
                token: token
            })
        )
    }
    const onCerrarSession = () => {
        logout();
    };

    const logout = async () => {
        try {
            updateToken(false);
            nagivate("/login");
        } catch (error) {
            const err = error as AxiosError;
        }
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={`${process.env.REACT_APP_API_COMISIONES}${perfil}`} />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{nombreCompleto}</Typography>
                </MenuItem>
                <MenuItem onClick={onCerrarSession}>
                    <Typography textAlign="center">Cerrar Session</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default Option;