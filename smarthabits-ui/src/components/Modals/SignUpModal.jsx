import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

// Importamos el archivo CSS
import './SignUpModal.css';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';
import usernameIcon from '../../images/username.png';
import nameIcon from '../../images/user01.png';
import lastnameIcon from '../../images/user02.png';

const SignUpModal = ({ show, handleClose, setShowLogin }) => {

  // Estado para los datos ingresados
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    username: ''
  });

  // Función para manejar los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para resetear los campos del formulario
  const resetForm = () => {
    setFormData({
      name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      username: ''
    });
  };

  // Función para manejar el envío del formulario de registro
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    try {
      // Realizamos la solicitud POST al endpoint de creación de usuario
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/create-user/`,
        formData
      );

      // Comprobamos la respuesta
      if (response.status === 201 || response.status === 200) {
        // Limpiamos el formulario y cerramos el modal después del registro exitoso
        resetForm();
        handleClose();

        swalMessages.successMessage(response.data?.message);

        // Abrimos el modal de inicio de sesión después del registro
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Error en handleSubmit: ', error);
      swalMessages.errorMessage(error.response?.data?.message);
    }
  };

  // Función para cerrar el modal del registro
  const handleCloseModal = () => {
    handleClose(); // Cierra el modal
    // Limpiamos las entradas al cerrar el modal
    resetForm();
  };

  return (

    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0">
        {/* Título del modal */}
        <Modal.Title>Nuevo Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
          {[
            { id: 'name',             icon: nameIcon,     placeholder: 'Nombre(s)',            type: 'text' },
            { id: 'last_name',        icon: lastnameIcon, placeholder: 'Apellido(s)',          type: 'text' },
            { id: 'email',            icon: emailIcon,    placeholder: 'Correo',               type: 'email' },
            { id: 'password',         icon: passwordIcon, placeholder: 'Contraseña',           type: 'password', minLength: 8 },
            { id: 'confirm_password', icon: passwordIcon, placeholder: 'Confirmar Contraseña', type: 'password', minLength: 8 },
            { id: 'username',         icon: usernameIcon, placeholder: 'Usuario',              type: 'text',     minLength: 8, maxLength: 12 }
          ].map((field) => (
            <div className="input-group mb-3" key={field.id}>
              <span className="input-group-text" id={`${field.id}-addon`}>
                <img src={field.icon} alt="..." className="input-icon" />
              </span>

              <input
                type={field.type}
                id={field.id}
                name={field.id}
                className="form-control rounded-input"
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={handleInputChange}
                required
                minLength={field.minLength}
                maxLength={field.maxLength}
              />
            </div>
          ))}

          {/* Botón para enviar los datos ingresados */}
          <Button type="submit" className='btn-primary'>
            Enviar
          </Button>
        </form>
      </Modal.Body>

      {/* Texto después del botón */}
      <Modal.Footer className="d-flex justify-content-center border-0">
        <span className="footer-text">
          ¿Ya tienes una cuenta?{" "}

          <span
            className="text-primary text-decoration-none"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleCloseModal();
              setShowLogin(true);
            }}
          >
            Inicia sesión
          </span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;