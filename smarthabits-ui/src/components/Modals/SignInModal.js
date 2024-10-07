import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './SignInModal.css';
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';
import usernameIcon from '../../images/username.png';
import nameIcon from '../../images/user.png';
import lastnameIcon from '../../images/user02.png';

const SignInModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Previene el envío del formulario por defecto
    console.log("Submit SignIn");
    console.log('email', email);
    console.log('password', password);
    console.log('username', username);
    console.log('name', name);
    console.log('lastname', lastname);
    setEmail('');
    setPassword('');
    setUsername('');
    setName('');
    setLastname('');
    handleClose();
  };

  const handleCloseModal = () => {
    handleClose(); // Cierra el modal
    // Limpiar las entradas al cerrar el modal
    setEmail('');
    setPassword('');
    setUsername('');
    setName('');
    setLastname('');
  };


  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit}>
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
          <div className="input-group mb-3">
            <span className="input-group-text" id="name-addon">
              <img src={lastnameIcon} alt="name-icon" className="input-icon" />
            </span>
            <input
              type="text"
              id="lastname"
              className="form-control rounded-input"
              placeholder="Apellido(s)"
              aria-label="Nombre"
              aria-describedby="lastname-addon"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
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

          <div className="input-group mb-3">
            <span className="input-group-text" id="username-addon">
              <img src={usernameIcon} alt="username-icon" className="input-icon" />
            </span>
            <input
              type="text"
              id="username"
              className="form-control rounded-input"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="username-addon"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={8}
              maxLength={12}
            />
          </div>


          {/* Mueve el botón de enviar dentro del formulario */}
          <Button type="submit" className="form-btn" variant="primary">
            Enviar
          </Button>
        </form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0">
        <span className='footer-text'>
          ¿Ya tienes una cuenta? <a className='text-decoration-none' href="./">Inicia sesión</a>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default SignInModal;
