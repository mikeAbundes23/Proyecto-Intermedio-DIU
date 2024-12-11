import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importamos el archivo CSS
import './Navbar.css';

// Importamos la autenticación
import { AuthContext } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

// Importamos los modales de Login y Registro
import LoginModal from '../Modals/LoginModal';
import SignUpModal from '../Modals/SignUpModal';

// Importamos los botones del navbar una vez logueado
import UserButtons from './UserButtons';

// Importamos los íconos (imágenes png)
import logo from '../../images/logo-icono.png';
import letras from '../../images/letras.png';

const Navbar = () => {
  
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();

  // Estados para los modales de Login y Registro
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Función para cerrar la sesión
  const handleLogout = () => {
    const keysToRemove = [
      'access_token',
      process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME,
      'reminderShown',
      'userData',
      'userHabits'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    updateUserData(null);
    navigate('/');
    logout();
  };

  return (
    
    <>
      <nav className="navbar">
        {/* Logo de la página */}
        <div className="navbar-logo">
          <a href='/habits'>
            <img src={logo} alt="..." className="logo" />
            <img src={letras} alt="..." className="app-name" />
          </a>
        </div>

        {/* Botones de Iniciar sesión y Registro */}
        <div className="navbar-buttons">
          {isAuthenticated ? (
            <UserButtons userData={userData} handleLogout={handleLogout} />
          ) : (
            <>
              <button className="navbar-btn" onClick={() => setShowSignUp(true)} id="signinBtn">
                Registrarse
              </button>

              <button className="navbar-btn" onClick={() => setShowLogin(true)} id="loginBtn">
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Modales de Iniciar sesión y Registro */}
      <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} setShowLogin={setShowLogin} />
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} setShowSignUp={setShowSignUp} />
    </>
  );
};

export default Navbar;