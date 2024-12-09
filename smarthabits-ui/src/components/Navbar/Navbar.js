import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importamos el archivo CSS
import './Navbar.css';

// Importamos la autenticación
import { AuthContext } from '../../context/AuthContext';

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
  const navigate = useNavigate();

  // Estados para los modales de Login y Registro
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Estado para los datos del usuario
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    image: null
  });

  // Funciones para manejar el abrir y cerrar de los modales de Login y Registro
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignin = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  // Función para cerrar la sesión
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME);
    localStorage.removeItem('reminderShown');
    navigate('/');
    logout();
  };

  // Función para obtener los datos del usuario
  const fetchData = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      
      // Establecemos los datos del usuario
      setUser(response.data.data);
    } catch (error) {
      console.error("Error completo en fetchData: ", error);
    }
  };

  // Función para obtener los datos al cargar la página
  useEffect(() => {
    fetchData();
  }, []);

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
            <UserButtons userData={user} handleLogout={handleLogout} />
          ) : (
            <>
              <button className="navbar-btn" onClick={handleShowSignUp} id="signinBtn">
                Registrarse
              </button>

              <button className="navbar-btn" onClick={handleShowLogin} id="loginBtn">
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