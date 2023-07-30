import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "../../Components/NavBar/NavBar";

interface Props {
    valid: boolean;
    children: React.ReactNode;
    redirrecTo: string;
    nombreCompleto: string;
    perfil: string;
}

export const ProtectorRoute = ({ children, valid, redirrecTo, nombreCompleto, perfil }: Props) => {
    //console.log('verificando',valid)
    if (!valid) {
        return (<Navigate to={redirrecTo} />)
    }
    else {
        //return (<SideBar nombreCompleto={nombreCompleto} perfil={perfil}><Outlet /></SideBar>);
        return (<NavBar nombreCompleto={nombreCompleto} perfil="dsdasd"><Outlet /></NavBar >);
    }
    
}