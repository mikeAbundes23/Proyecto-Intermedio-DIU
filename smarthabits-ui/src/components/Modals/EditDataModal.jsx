import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./EditDataModal.css";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

const EditDataModal = ({ show, handleClose, userData, onUserUpdate }) => {

    // Estado para los datos del usuario
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                last_name: userData.last_name || "",
                username: userData.username || "",
                email: userData.email || "",
                password: "",
                confirm_password: ""
            });
        }
    }, [userData]);

    // Función para manejar el formulario de creación de hábito
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirm_password) {
            swalMessages.errorMessage("Las contraseñas no coinciden Inténtalo nuevamente");
            return;
        }

        const token = localStorage.getItem('access_token');

        if (!token) return;

        try {
            const dataToUpdate = {...formData};
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
                delete dataToUpdate.confirm_password;
            }

            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/update-user/`,
                dataToUpdate,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            swalMessages.successMessage("¡Tus datos han sido actualizados correctamente!");
            if (onUserUpdate) onUserUpdate();
            handleClose();
        } catch (error) {
            swalMessages.errorMessage(
                error.response?.data?.message || 
                "Error al actualizar los datos<br>Por favor, inténtalo más tarde"
            );
        }
    };

    return (
        <>
            {/* Modal para editar los datos del usuario */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Editar Datos</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Nombre(s) del usuario */}
                        <Form.Group className="form-input" controlId="formUserName">
                            <Form.Label>Nombre(s)</Form.Label>

                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Apellido(s) del usuario */}
                        <Form.Group className="form-input" controlId="formUserLastName">
                            <Form.Label>Apellido(s)</Form.Label>

                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Username */}
                        <Form.Group className="form-input" controlId="formUsername">
                            <Form.Label>Username</Form.Label>

                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Correo */}
                        <Form.Group className="form-input" controlId="formEmail">
                            <Form.Label>Correo</Form.Label>

                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Contraseña */}
                        <Form.Group className="form-input" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>

                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Confirmar contraseña */}
                        <Form.Group className="form-input" controlId="formConfirmPassword">
                            <Form.Label>Confirmar Contraseña</Form.Label>

                            <Form.Control
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                {/* Botón para enviar los datos ingresados */}
                <Modal.Footer className="border-0">
                    <Button className="btn-primary" variant="success">
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditDataModal;