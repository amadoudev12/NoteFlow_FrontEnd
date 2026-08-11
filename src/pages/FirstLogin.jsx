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
        const res = await userService.updateUser(formData)
        const { token, configurationComplete, firstLogin, signatureComplete, role } = res.data || {}
        const signatureRequise = ['ADMIN', 'ENSEIGNANT'].includes(role)
        if (!token || !configurationComplete || firstLogin !== false || (signatureRequise && signatureComplete !== true)) {
            throw new Error('La configuration du compte n’a pas été confirmée par le serveur.')
        }
        const destinations = { ADMIN: '/dashboard/admin', ENSEIGNANT: '/dashboard/enseignant', ELEVE: '/dashboard/eleve' }
        if (!destinations[role]) throw new Error('Rôle utilisateur inconnu.')
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        return destinations[role]
    }

    return (
        <FirstLoginComponnent
            userName={profile?.nom || user?.login}
            onFormDataReady={updateUser}
            onCompleted={(destination) => navigate(destination, { replace: true })}
            user={user}
        />
    )
}
