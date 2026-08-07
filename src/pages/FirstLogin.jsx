import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import FirstLoginComponnent from '../components/FirstLoginComponnent'
import { useNavigate } from 'react-router-dom'
import userService from '../../services/userService'

export default function FirstLogin() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        try {
            const decodedToken = jwtDecode(token)
            // adapte ce chemin à la forme réelle de ton token (voir login.js)
            const userData = decodedToken?.user?.user || decodedToken?.user
            setUser(userData)
            setProfile(decodedToken.profil)
        } catch (err) {
            console.error('Impossible de décoder le token', err)
            localStorage.removeItem('token')
            navigate('/login')
        }
    }, [navigate])

    const updateUser = async (formData) => {
        try {
            const res = await userService.updateUser(formData)
            if (res.status === 200 || res.status === 201) {
                // le token en localStorage contient encore firstLogin: true,
                // il faut le supprimer sinon /login rebondit direct vers /modification
                localStorage.removeItem('token')
                navigate('/login')
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <FirstLoginComponnent
            userName={profile?.nom || user?.login}
            onFormDataReady={updateUser}
            user={user}
        />
    )
}