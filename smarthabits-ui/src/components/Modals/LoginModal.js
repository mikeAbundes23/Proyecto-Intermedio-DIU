import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './LoginModal.css';
import emailIcon from '../../images/mail.png';
import passwordIcon from '../../images/password.png';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ show, handleClose, setShowSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  // Función para cerrar el modal de login y abrir el de registro
  const openSignupModal = () => {
    handleClose(); // Cierra el modal de login
    setShowSignUp(true); // Abre el modal de registro
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submit login");
      console.log('username:', username);
      console.log('password:', password);

      // Make a POST request to the login endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/user/login/', {
        username: username,  // Use 'email' here assuming your backend expects 'username' field
        password: password,
      });

      const { access } = response.data;  // Extract the access token from response

      console.log('Login exitoso:', access);

      // Store the access token in local storage
      localStorage.setItem('access_token', access);

      // Update global authentication state using your existing login function
      login(access); // Assuming this function updates global auth state and stores the token in a cookie

      // Clear the form fields and close the modal
      setUsername('');
      setPassword('');
      handleClose();

      navigate('/habits');
    } catch (error) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
      console.error('Error en el login:', error);
    }
  };

  const handleCloseModal = () => {
    handleClose(); // Cierra el modal
    // Limpiar las entradas al cerrar el modal
    setUsername('');
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
            <span className="input-group-text" id="username-addon">
              <img src={emailIcon} alt="username-icon" className="input-icon" />
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

          {error && <p className="text-danger">{error}</p>}

          <Button type="submit" className="form-btn" variant="primary">
            Iniciar Sesión
          </Button>
        </form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center border-0">
        <span className="footer-text">
          ¿No tienes una cuenta?{" "}
          <span
            className="text-primary text-decoration-none"
            style={{ cursor: "pointer" }}
            onClick={openSignupModal}
          >
            Regístrate
          </span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
