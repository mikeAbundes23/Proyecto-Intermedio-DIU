import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./EditImageButton.css";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import uploadIcon from '../../images/upload.png';

const EditImageButton = ({ userData, onImageUpdated }) => {

    // Estado para mostrar el modal
    const [showEditImageModal, setShowEditImageModal] = useState(false);
    // Estado para la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState(null);
    // Estado para el nombre del archivo
    const [fileName, setFileName] = useState('Ninguna imagen seleccionada');

    // Función para manejar la imagen
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setFileName(file.name);
        }
    };

    // Función para mostrar el modal de editar imagen
    const openEditImageModal = () => {
        setShowEditImageModal(true);
    };

    // Función para cerrar el modal de editar imagen
    const closeEditImageModal = () => {
        setShowEditImageModal(false);
        setSelectedImage(null);
        setFileName('Ninguna imagen seleccionada');
    };

    // Función para cambiar la imagen de perfil
    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token");

        if (!token || !selectedImage) {
            swalMessages.errorMessage('Por favor selecciona una imagen');  
        }

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

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
            if ((response.status === 201 || response.status === 200) && response.data) {
                // Notificamos al componente principal
                onImageUpdated(response.data);

                swalMessages.successMessage("¡Tu imagen ha sido actualizada correctamente!");
                closeEditImageModal();
            }
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
        }
    };

    return (

        <>
            {/* Botón para editar la foto de perfil */}
            <Button className="btn-primary edit-image-btn" onClick={openEditImageModal}>
                Editar imagen
            </Button>

            {/* Modal para editar la foto de perfil */}
            <Modal show={showEditImageModal} onHide={closeEditImageModal} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>
                        Editar Imagen
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="image-upload-div">
                        <label 
                            htmlFor="photo-upload"
                        >
                            <img src={uploadIcon} alt="..." className='label-icon' />
                            <span>
                                Subir foto
                            </span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="d-none"
                            id="photo-upload"
                        />
                        <span className="file-name mt-2 d-block">
                            {fileName}
                        </span>
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