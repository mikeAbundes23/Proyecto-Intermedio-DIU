import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './LoginModal.css';
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';

const LoginModal = ({ show, handleClose, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto
    console.log("Submit login");
    console.log('email', email);
    console.log('password', password);
    setEmail('');
    setPassword('');
    setIsAuthenticated(true);
    handleClose();
  };

  const handleCloseModal = () => {
    handleClose(); // Cierra el modal
    // Limpiar las entradas al cerrar el modal
    setEmail('');
    setPassword('');
  };


  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Ingresar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
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

          {/* Mueve el botón de enviar dentro del formulario */}
          <Button type="submit" className="form-btn" variant="primary">
            Iniciar Sesión
          </Button>
        </form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0">
        <span className='footer-text'>
          ¿No tienes una cuenta? <a className='text-decoration-none' href="./">Regístrate</a>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
