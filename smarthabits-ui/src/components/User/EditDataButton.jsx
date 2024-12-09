import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./EditDataButton.css";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

const EditDataButton = ({ userData, onUserUpdated }) => {

    // Estado para mostrar el modal
    const [showEditDataModal, setShowEditDataModal] = useState(false);

    // Estado para los datos del usuario
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        image: null
    });

    // Estados para manejar los campos del formulario
    const [initialData, setInitialData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        if (userData) {
            const initialFormData = {
                name: userData.name || "",
                last_name: userData.last_name || "",
                username: userData.username || "",
                email: userData.email || "",
                password: "",
                confirm_password: ""
            };
            setFormData(initialFormData);
            setInitialData(initialFormData);
        }
    }, [userData]);

    // Función para mostrar el modal de editar datos
    const openEditDataModal = () => {
        setShowEditDataModal(true);
    };

    // Función para cerrar el modal de editar datos
    const closeEditDataModal = () => {
        setFormData(initialData);
        setShowEditDataModal(false);
    };

    // Función para manejar el cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value
        };
        setFormData(newFormData);
        
        // Verificamos si hay cambios en algún campo
        const hasFieldChanges = Object.keys(newFormData).some(key => {
            // Ignoramos los campos de contraseña al verificar cambios
            if (key === 'password' || key === 'confirm_password') return false;

            return newFormData[key] !== userData[key];
        });
        
        // Verificamos si hay cambios en la contraseña
        const hasPasswordChanges = newFormData.password !== '' || newFormData.confirm_password !== '';
        
        setHasChanges(hasFieldChanges || hasPasswordChanges);
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificamos si hay algún cambio
        if (!hasChanges) return;
        
        // Si se está intentando cambiar la contraseña, verificamos que ambos campos estén llenos y coincidan
        if (formData.password || formData.confirm_password) {
            if (!formData.password || !formData.confirm_password) {
                swalMessages.errorMessage("Debes llenar ambos campos para cambiar la contraseña");
                return;
            }
            if (formData.password !== formData.confirm_password) {
                swalMessages.errorMessage("Las contraseñas no coinciden. Inténtalo nuevamente");
                return;
            }
        }

        const token = localStorage.getItem('access_token');

        if (!token) return;

        try {
            const dataToUpdate = {...formData};
            // Solo incluímos los campos que han cambiado
            Object.keys(dataToUpdate).forEach(key => {
                if (key !== 'password' && 
                    key !== 'confirm_password' && 
                    dataToUpdate[key] === initialData[key]) {
                    delete dataToUpdate[key];
                }
            });

            // Si no se cambió la contraseña, eliminamos esos campos
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

            // Verificamos que la respuesta sea exitosa y contenga datos
            if ((response.status === 201 || response.status === 200) && response.data) {
                const updatedUser = {
                    ...response.data
                };

                // Notificamos al componente principal
                onUserUpdated(updatedUser);

                swalMessages.successMessage("¡Tus datos han sido actualizados correctamente!");
                closeEditDataModal();
            }
        } catch (error) {
            swalMessages.errorMessage(error.response?.data?.message);
        }
    };

    return (

        <>
            {/* Botón para editar los datos */}
            <Button className="btn-primary edit-data-btn" onClick={openEditDataModal}>
                Editar datos
            </Button>


            {/* Modal para editar los datos del usuario */}
            <Modal show={showEditDataModal} onHide={closeEditDataModal} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Editar Datos</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
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
                    <Button 
                        className="btn-primary" 
                        variant="success"
                        onClick={handleSubmit}
                        disabled={!hasChanges}
                    >
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditDataButton;