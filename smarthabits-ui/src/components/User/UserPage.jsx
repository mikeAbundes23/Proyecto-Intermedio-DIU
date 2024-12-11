import React from "react";
import { useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";

// Importamos el archivo CSS
import "./UserPage.css";

// Importamos los componentes necesarios
import Navbar from "../Navbar/Navbar";
import EditDataButton from './EditDataButton';
import EditImageButton from './EditImageButton';

// Importamos los íconos (imágenes png)
import userIcon from "../../images/user-logo.png";
import { useUser } from "../../context/UserContext";

const UserPage = () => {

    const navigate = useNavigate(); // Hook para manejar la navegación
    
    // Estado para los datos del usuario
    const { userData } = useUser();

    return (
        
        <>
            {/* Componente NavBar */}
            <Navbar />

            {/* Botón para regresar a la vista anterior */}
            <button className="back-button" onClick={() => navigate(-1)}>
                <BiChevronLeft size={40} />
            </button>

            <div className="update-section">
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            {/* Título de la página */}
                            <h2>Editar perfil</h2>
                            {/* Botón para editar los datos */}
                            <EditDataButton />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 text-center user-image-div">
                            {/* Imagen de perfil */}
                            <div className="d-inline-block">
                                <img 
                                    src={userData?.image ? `${process.env.REACT_APP_API_URL}/${userData.image}` : userIcon}
                                    alt="..."
                                    className={`rounded-circle img-fluid ${userData?.image ? 'user-image' : 'user-icon'}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = userIcon;
                                    }}
                                />
                            </div>

                            {/* Botón para editar la imagen de perfil */}
                            <div className="mt-3">
                                <EditImageButton />
                            </div>
                        </div>

                        {/* Datos del usuario */}
                        <div className="col-md-8">
                            <div className="user-info mt-md-0 mt-4">
                                {[
                                    { label: 'Nombre(s):', value: userData?.name },
                                    { label: 'Apellido(s):', value: userData?.last_name },
                                    { label: 'Username:', value: userData?.username },
                                    { label: 'Correo:', value: userData?.email },
                                    { label: 'Contraseña:', value: '********' }
                                ].map(({ label, value }) => (
                                    <div key={label} className="info-row d-flex mb-3">
                                        <div className="info-label">{label}</div>
                                        <div className="info-value">{value}</div>
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