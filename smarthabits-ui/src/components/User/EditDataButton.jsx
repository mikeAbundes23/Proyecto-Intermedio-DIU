import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./EditDataButton.css";

// Importamos el contexto
import { useUser } from "../../context/UserContext";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

const EditDataButton = () => {

    const { userData, updateUserData } = useUser();
    // Estado para mostrar el modal
    const [showModal, setShowModal] = useState(false);

    // Estado para los datos del usuario
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    // Estado para manejar los campos del formulario
    const [hasChanges, setHasChanges] = useState(false);

    // Función para obtener los datos al cargar la página
    useEffect(() => {
        if (userData) {
            setFormData ({
                ...formData,
                name: userData.name || "",
                last_name: userData.last_name || "",
                username: userData.username || "",
                email: userData.email || "",
                password: "",
                confirm_password: ""
            });
        }
    }, [userData]);

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

        const token = localStorage.getItem('access_token');

        if (!token) return;

        const dataToUpdate = {};
        // Solo incluímos los campos que han cambiado
        Object.keys(formData).forEach(key => {
            if (key !== 'password' && 
                key !== 'confirm_password' && 
                formData[key] !== userData[key]) {
                dataToUpdate[key] = formData[key];
            }
        });
        // Si no se cambió la contraseña, eliminamos esos campos
        if (formData.password) {
            dataToUpdate.password = formData.password;
            dataToUpdate.confirm_password = formData.confirm_password;
        }
            
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/update-user/`,
                dataToUpdate,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Verificamos que la respuesta sea exitosa
            if (response.data) {
                // Notificamos al componente principal
                updateUserData(response.data.data);
                swalMessages.successMessage(response.data?.message);
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error en handleSubmit: ', error);
            swalMessages.errorMessage(error.response?.data?.message);
        }
    };

    return (

        <>
            {/* Botón para editar los datos */}
            <Button className="btn-primary edit-data-btn" onClick={() => setShowModal(true)}>
                Editar datos
            </Button>

            {/* Modal para editar los datos del usuario */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Editar Datos</Modal.Title>
                </Modal.Header>

                {/* Inputs del modal */}
                <Modal.Body>
                    <Form>
                        {[
                            { id: 'name',             label: 'Nombre(s)',            type: 'text' },
                            { id: 'last_name',        label: 'Apellido(s)',          type: 'text' },
                            { id: 'username',         label: 'Username',             type: 'text' },
                            { id: 'email',            label: 'Correo',               type: 'email' },
                            { id: 'password',         label: 'Contraseña',           type: 'password' },
                            { id: 'confirm_password', label: 'Confirmar Contraseña', type: 'password' }
                        ].map(field => (
                            <Form.Group key={field.id} className="form-input" controlId={`form${field.id}`}>
                                <Form.Label>{field.label}</Form.Label>

                                <Form.Control
                                    type={field.type}
                                    name={field.id}
                                    value={formData[field.id]}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        ))}
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