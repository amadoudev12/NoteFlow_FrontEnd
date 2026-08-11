import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = () => {
    const token = localStorage.getItem('token')
    const location = useLocation()
    if(!token){
        return <Navigate to='/login'/>
    }

    try {
        const decodedToken = jwtDecode(token)
        const role = decodedToken?.user?.user?.role || decodedToken?.user?.role || decodedToken?.role
        const firstLogin = decodedToken?.user?.user?.firstLogin ?? decodedToken?.user?.firstLogin ?? decodedToken?.firstLogin
        const doitCompleterPremiereConnexion =
            firstLogin && role !== "SUPERADMIN" && role !== "SUPER_ADMIN"

        if (doitCompleterPremiereConnexion && location.pathname !== "/modification") {
            return <Navigate to='/modification' replace />
        }
    } catch {
        localStorage.removeItem('token')
        return <Navigate to='/login' replace />
    }
    return (
        <Outlet/>
    )
}

export default PrivateRoute
