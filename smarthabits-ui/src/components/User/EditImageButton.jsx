import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

// Importamos el archivo CSS
import "./EditImageButton.css";

// Importamos los íconos (imágenes png)
import uploadIcon from '../../images/upload.png';

const EditImageButton = ({ user, onImageUpdated }) => {

    // Estado para mostrar el modal
    const [showEditImageModal, setShowEditImageModal] = useState(false);

    // Función para manejar la imagen
    const handleImageUpload = (e) => {

    };

    // Función para mostrar el modal de editar imagen
    const openEditImageModal = () => {
        setShowEditImageModal(true);
    };

    // Función para cerrar el modal de editar imagen
    const closeEditImageModal = () => {
        setShowEditImageModal(false);
    };

    // Función para cambiar la imagen de perfil
    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) return;


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
                        <span>
                            {/* {user.image ? user.image.name : 'Ninguna foto seleccionada'} */}
                        </span>
                    </div>
                </Modal.Body>

                {/* Botón para enviar la imagen seleccionada */}
                <Modal.Footer className="border-0">
                    <Button
                        className="btn-primary"
                        varian="success"
                        onClick={handleSubmit}
                    >
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default EditImageButton;