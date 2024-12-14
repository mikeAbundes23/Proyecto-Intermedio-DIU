import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { getCookie } from '../helpers/Auth';

// Creamos el contexto de autenticación
export const UserContext = createContext();

// Función que provee el contexto de autenticación
export const UserProvider = ({ children }) => {

    // Estado para controlar la información del usuario logueado
    const [userData, setUserData] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);
    
    // Función para obtener los datos del usuario
    const fetchUserData = async () => {
        const token = getCookie(process.env.REACT_APP_TOKEN_COOKIE_NAME);
        
        if (!token) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data.data);
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    };

    // Función para obtener los datos del usuario cuando está autenticado
    useEffect(() => {
        if (isAuthenticated && !userData) {
            fetchUserData();
        }
        if (!isAuthenticated) {
            setUserData(null);
        }
    }, [isAuthenticated]);

    // Función para actualizar los datos del usuario
    const updateUserData = async (newData) => {
        setUserData(newData);
    };

    return (
        
        <UserContext.Provider value={{ userData, updateUserData, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto del usuario
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};