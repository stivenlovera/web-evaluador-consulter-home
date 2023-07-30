import { Navigate, Outlet } from "react-router-dom";

interface Props {
    valid: boolean;
    children: React.ReactNode;
    redirrecTo: string
}

export const NoProtectorRoute = ({ children, valid, redirrecTo }: Props) => {
    //console.log('verificando libre', valid)
    if (valid) {
        return (<Navigate to={redirrecTo} />)
    }
    else {
        return (<Outlet />);
    }
}