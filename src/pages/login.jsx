import React from 'react'
import LoginComponent from '../components/login'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function login() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const decodedToken = jwtDecode(token)
            const role = decodedToken?.user?.user?.role || decodedToken?.user?.role || decodedToken?.role
            const firstLogin = decodedToken?.user?.firstLogin ?? decodedToken?.firstLogin

            if (firstLogin && role !== 'ADMIN') {
                navigate('/modification')
                return
            }

            if (role === 'ENSEIGNANT') {
                navigate('/dashboard/enseignant')
                return
            } else if (role === 'ELEVE') {
                navigate('/dashboard/eleve')
                return
            } else {
                navigate('/dashboard/admin')
                return
            }
        } catch (error) {
            console.error('Impossible de décoder le token', error)
        }
    }, [navigate])
  return (
    <div>
        <LoginComponent/>
    </div>
  )
}
