import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./EditImageButton.css";

// Importamos el contexto
import { useUser } from "../../context/UserContext";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import uploadIcon from '../../images/upload.png';

const EditImageButton = () => {

    const { updateUserData } = useUser();
    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);
    // Estado para la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState(null);
    // Estado para el nombre del archivo
    const [fileName, setFileName] = useState('Ninguna imagen seleccionada');

    // Función para cambiar la imagen de perfil
    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token");

        if (!token || !selectedImage) {
            swalMessages.errorMessage('Por favor selecciona una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/update-image/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Verificamos que la respuesta sea exitosa y contenga datos
            if (response.data) {
                const userResponse = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/user/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // Notificamos al componente principal
                updateUserData(userResponse.data.data);
                swalMessages.successMessage(response.data?.message);
                setShowModal(false);
                setSelectedImage(null);
                setFileName('Ninguna imagen seleccionada');
            }
        } catch (error) {
            console.error('Error en handleSubmit: ', error);
            swalMessages.errorMessage(error.response?.data?.message);
        }
    };

    return (

        <>
            {/* Botón para editar la foto de perfil */}
            <Button className="btn-primary edit-image-btn" onClick={() => setShowModal(true)}>
                Editar imagen
            </Button>

            {/* Modal para editar la foto de perfil */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>
                        Editar Imagen
                    </Modal.Title>
                </Modal.Header>

                {/* Sección para elegir una imagen */}
                <Modal.Body>
                    <div className="image-upload-div">
                        <label htmlFor="photo-upload">
                            <img src={uploadIcon} alt="..." className='label-icon' />
                            <span>
                                Subir foto
                            </span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setSelectedImage(file);
                                    setFileName(file.name);
                                }
                            }}
                            className="d-none"
                            id="photo-upload"
                        />
                        <span className="file-name mt-2 d-block">{fileName}</span>
                    </div>
                </Modal.Body>

                {/* Botón para enviar la imagen seleccionada */}
                <Modal.Footer className="border-0">
                    <Button
                        className="btn-primary"
                        varian="success"
                        onClick={handleSubmit}
                        disabled={!selectedImage}
                    >
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default EditImageButton;