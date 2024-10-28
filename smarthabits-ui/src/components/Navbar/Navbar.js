import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importamos el archivo CSS
import './Navbar.css';

// Importamos los íconos (imágenes png)
import logo from '../../images/logo-icono.png';
import letras from '../../images/letras.png';

// Importamos los modales de Login y Registro
import LoginModal from '../Modals/LoginModal';
import SignUpModal from '../Modals/SignUpModal';

// Importamos los botones del navbar una vez logueado
import UserButtons from './UserButtons';

// Importamos la autenticación
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  // Estados para los modales de Login y Registro
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Funciones para manejar el abrir y cerrar de los modales de Login y Registro
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignin = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  const navigate = useNavigate();

  // Función para cerrar la sesión
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME);
    navigate('/');
    logout();
  };

  return (
    
    // Barra de navegación definida
    <>
      <nav className="navbar">
        {/* Logo de la página */}
        <div className="navbar-logo">
          <a href='/habits'>
            <img src={logo} alt="Logo" className="logo" />
            <img src={letras} alt="Logo" className="app-name" />
          </a>
        </div>

        {/* Botones de Iniciar sesión y Registro */}
        <div className="navbar-buttons">
          {isAuthenticated ? (
            <UserButtons handleLogout={handleLogout} />
          ) : (
            <>
              <button className="navbar-button" onClick={handleShowSignUp} id="signinBtn">
                Registrarse
              </button>

              <button className="navbar-button" onClick={handleShowLogin} id="loginBtn">
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Modales de Iniciar sesión y Registro */}
      <SignUpModal show={showSignUp} handleClose={handleCloseSignin} setShowLogin={setShowLogin} />
      <LoginModal show={showLogin} handleClose={handleCloseLogin} setShowSignUp={setShowSignUp} />
    </>
  );
};

export default Navbar;