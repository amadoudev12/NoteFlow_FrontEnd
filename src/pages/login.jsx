import React from 'react'
import LoginComponent from '../components/login'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const decodedToken = jwtDecode(token)
            const role = decodedToken?.user?.user?.role || decodedToken?.user?.role || decodedToken?.role 
            const firstLogin = decodedToken?.user?.user?.firstLogin ?? decodedToken?.user?.firstLogin ?? decodedToken?.firstLogin

            const doitCompleterPremiereConnexion =
                firstLogin && role !== "SUPERADMIN" && role !== "SUPER_ADMIN"

            if (doitCompleterPremiereConnexion) {
                navigate('/modification')
                return
            }
            switch (role) {
                case 'ENSEIGNANT':
                    navigate('/dashboard/enseignant');
                    break;

                case 'ELEVE':
                    navigate('/dashboard/eleve');
                    break;

                case 'ADMIN':
                    navigate('/dashboard/admin');
                    break;

                case 'SUPERADMIN':
                case 'SUPER_ADMIN':
                    navigate('/dashboard/super-admin');
                    break;

                default:
                    navigate('/login');
            }
        } catch (error) {
            console.error('Impossible de décoder le token', error)
            localStorage.removeItem('token')
        }
    }, [navigate])
  return (
    <div>
        <LoginComponent/>
    </div>
  )
}
