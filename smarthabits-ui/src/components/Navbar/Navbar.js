import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../../images/Icono.png';
import letras from '../../images/Letras.png';
import LoginModal from '../Modals/LoginModal';
import SignUpModal from '../Modals/SignUpModal';
import UserButtons from './UserButtons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignin = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo" />
          <img src={letras} alt="Logo" className="app-name" />
        </div>
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
      <SignUpModal show={showSignUp} handleClose={handleCloseSignin} setShowLogin={setShowLogin} />
      <LoginModal show={showLogin} handleClose={handleCloseLogin} setShowSignUp={setShowSignUp} />
    </>
  );
};

export default Navbar;

