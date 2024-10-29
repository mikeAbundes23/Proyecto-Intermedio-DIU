import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el archivo CSS
import './SignUpModal.css';

// Importamos los íconos (imágenes png)
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';
import usernameIcon from '../../images/username.png';
import nameIcon from '../../images/user01.png';
import lastnameIcon from '../../images/user02.png';

const SignUpModal = ({ show, handleClose, setShowLogin }) => {
  // Estados para los datos ingresados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  // Función para abrir el modal de login
  const handleOpenLogin = () => {
    handleClose(); // Cierra el modal de registro
    setShowLogin(true); // Abre el modal de inicio de sesión
  };

  // Función para manejar el envío del formulario de registro
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto

    // Validamos que las contraseñas coincidan
    if (password !== confirmPassword) {
      swalMessages.errorMessage('Las contraseñas no coinciden Inténtalo nuevamente');
      return;
    }

    try {
      // Realizamos la solicitud POST al endpoint de creación de usuario
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/create-user/`, {
        name: name,
        last_name: lastname,
        username: username,
        password: password,
        password_confirmation: confirmPassword,
        email: email,
      });

      // Comprobamos la respuesta
      if (response.data.message === "Usuario creado con éxito") {
        console.log('Registro exitoso:', response.data.message);

        // Limpiamos el formulario y cerramos el modal después del registro exitoso
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setName('');
        setLastname('');
        handleClose();

        swalMessages.successMessage("Tu cuenta ha sido creada exitosamente");

        // Abrimos el modal de inicio de sesión después del registro
        setShowLogin(true);
      }
    } catch (error) {
      swalMessages.errorMessage('No se pudo completar el registro Por favor, inténtalo nuevamente');
      console.error('Error en handleSubmit: ', error);
    }
  };

  // Función para cerrar el modal del registro
  const handleCloseModal = () => {
    handleClose(); // Cierra el modal
    // Limpiamos las entradas al cerrar el modal
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setName('');
    setLastname('');
  };

  return (

    // Modal de Registro
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0">
        {/* Título del modal */}
        <Modal.Title>Nuevo Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Nombre(s) del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="name-addon">
              <img src={nameIcon} alt="name-icon" className="input-icon" />
            </span>

            <input
              type="text"
              id="name"
              className="form-control rounded-input"
              placeholder="Nombre(s)"
              aria-label="Nombre"
              aria-describedby="name-addon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Apellido(s) del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="lastname-addon">
              <img src={lastnameIcon} alt="lastname-icon" className="input-icon" />
            </span>

            <input
              type="text"
              id="lastname"
              className="form-control rounded-input"
              placeholder="Apellido(s)"
              aria-label="Apellido"
              aria-describedby="lastname-addon"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          {/* Correo del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="email-addon">
              <img src={emailIcon} alt="email-icon" className="input-icon" />
            </span>

            <input
              type="email"
              id="email"
              className="form-control rounded-input"
              placeholder="Correo"
              aria-label="Correo"
              aria-describedby="email-addon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contraseña del usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="password-addon">
              <img src={passwordIcon} alt="password-icon" className="input-icon" />
            </span>

            <input
              type="password"
              id="password"
              className="form-control rounded-input"
              placeholder="Contraseña"
              aria-label="Contraseña"
              aria-describedby="password-addon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          
          {/* Confirmar contraseña */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="confirm-password-addon">
              <img src={passwordIcon} alt="confirm-password-icon" className="input-icon" />
            </span>

            <input
              type="password"
              id="confirmPassword"
              className="form-control rounded-input"
              placeholder="Confirmar Contraseña"
              aria-label="Confirmar Contraseña"
              aria-describedby="confirm-password-addon"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {/* Nombre de usuario */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="username-addon">
              <img src={usernameIcon} alt="username-icon" className="input-icon" />
            </span>

            <input
              type="text"
              id="username"
              className="form-control rounded-input"
              placeholder="Usuario"
              aria-label="Usuario"
              aria-describedby="username-addon"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={8}
              maxLength={12}
            />
          </div>

          {/* Botón para enviar los datos ingresados */}
          <Button type="submit" className="form-btn" variant="primary">
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
            onClick={handleOpenLogin}
          >
            Inicia sesión
          </span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;