import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import axios from "axios";

// Importamos el archivo CSS
import "./UserPage.css";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import EditDataButton from './EditDataButton';
import EditImageButton from './EditImageButton';

// Importamos los íconos (imágenes png)
import userIcon from "../../images/user-logo.png";

const userFields = [
    { label: 'Nombre(s):', key: 'name', getValue: (user) => user.name },
    { label: 'Apellidos(s):', key: 'last_name', getValue: (user) => user.last_name },
    { label: 'Username:', key: 'username', getValue: (user) => user.username },
    { label: 'Correo:', key: 'email', getValue: (user) => user.email },
    { label: 'Contraseña:', key: 'password', getValue: () => '********' }
]

const UserPage = () => {

    const navigate = useNavigate(); // Hook para manejar la navegación
    
    // Estado para los datos del usuario
    const [user, setUser] = useState({
        name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        image: null
    });

    // Función para manejar el click en el botón de retroceso
    const handleGoBack = () => {
        navigate(-1); // Navega hacia la página anterior
    };

    // Función para obtener los datos del usuario
    const fetchData = async () => {
        const token = localStorage.getItem('access_token');

        if (!token) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); 
            
            // Establecemos los datos del usuario
            setUser(response.data.data);
        } catch (error) {
            console.error("Error completo en fetchData: ", error);
            swalMessages.errorMessage(error.response?.data?.message);
        }
    };

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        fetchData();
    }, []);

    // Funciones para actualizar la vista de configuración
    const handleUserUpdated = (user) => {
        // Refrescamos los datos del usuario
        fetchData();
    };

    const handleImageUpdated = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser((prev) => ({ ...prev, image: file }));
        }
    };

    return (
        
        <>
            {/* Componente NavBar */}
            <Navbar />

            {/* Botón para regresar a la vista anterior */}
            <button className="back-button" onClick={handleGoBack}>
                <BiChevronLeft size={40} />
            </button>

            <div className="update-section">
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            {/* Título de la página */}
                            <h2>Editar perfil</h2>
                            {/* Botón para editar los datos */}
                            <EditDataButton userData={user} onUserUpdated={handleUserUpdated} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 text-center user-image-div">
                            {/* Imagen de perfil */}
                            <div className="d-inline-block">
                                {user.image ? (
                                    <img 
                                        src={`${process.env.REACT_APP_API_URL}/${user.image}`}
                                        alt="..."
                                        className="rounded-circle img-fluid user-image"
                                    />
                                ) : (
                                    <img 
                                        src={userIcon}
                                        alt="..."
                                        className="rounded-circle img-fluid user-icon"
                                    />
                                )}
                            </div>

                            {/* Botón para editar la imagen de perfil */}
                            <div className="mt-3">
                                <EditImageButton userData={user} onImageUpdated={handleImageUpdated} />
                            </div>
                        </div>

                        {/* Datos del usuario */}
                        <div className="col-md-8">
                            <div className="user-info mt-md-0 mt-4">
                                {userFields.map(({ label, key, getValue }) => (
                                    <div key={key} className="info-row d-flex mb-3">
                                        <div className="info-label">
                                            {label}
                                        </div>
                                        <div className="info-value">
                                            {getValue(user)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPage;