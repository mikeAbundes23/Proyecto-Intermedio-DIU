import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import axios from "axios";

// Importamos el archivo CSS
import "./UserPage.css";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";

// Importamos los modales de Login y Registro
import EditDataModal from '../Modals/EditDataModal';
import EditImageModal from '../Modals/EditImageModal';

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
        password: ""
    });

    // Estados para mostrar los modales de 'Editar datos' y 'Editar imagen'
    const [showEditData, setShowEditData] = useState(false);
    const [showEditImage, setShowEditImage] = useState(false);

    // Funciones para manejar el abrir y cerrar de los modales de 'Editar datos' y 'Editar imagen'
    const handleCloseEditData = () => setShowEditData(false);
    const handleShowEditData = () => setShowEditData(true);

    const handleCloseEditImage = () => setShowEditImage(false);
    const handleShowEditImage = () => setShowEditImage(true);

    // Función para manejar el click en el botón de retroceso
    const handleGoBack = () => {
        navigate(-1); // Navega hacia la página anterior
    };

    // Función para obtener los datos del usuario
    const fetchData = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error("No token found, please log in.");
            return;
        }

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
            swalMessages.errorMessage(error.response?.data?.message || "Error al obtener los datos<br>Por favor, inténtalo más tarde");
        }
    };

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        fetchData();
    }, []);

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
                            <button className="btn-primary edit-data-btn" onClick={handleShowEditData}>
                                Editar datos
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 text-center user-image-div">
                            {/* Imagen de perfil */}
                            <div className="position-relative d-inline-block">
                                <img 
                                    src={userIcon}
                                    alt="..."
                                    className="rounded-circle img-fluid user-image"
                                />
                            </div>

                            {/* Botón para editar la imagen de perfil */}
                            <div className="mt-3">
                                <button className="btn-primary edit-image-btn" onClick={handleShowEditImage}>
                                    Editar imagen
                                </button>
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

            {/* Modales de 'Editar datos' y 'Editar imagen' */}
            <EditDataModal 
                show={showEditData} 
                handleClose={handleCloseEditData} 
                userData={user}
                setShowEditImage={setShowEditImage} />
            <EditImageModal 
                show={showEditImage} 
                handleClose={handleCloseEditImage} 
                onImageUpdate={fetchData}
                setShowEditData={setShowEditData} />
        </>
    );
};

export default UserPage;