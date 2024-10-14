import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../../images/Icono.png';
import letras from '../../images/Letras.png';
import LoginModal from '../Modals/LoginModal';
import SigninModal from '../Modals/SignInModal';
import UserButtons from './UserButtons';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignin = () => setShowSignin(false);
  const handleShowSignin = () => setShowSignin(true);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo" />
          <img src={letras} alt="Logo" className="app-name" />
        </div>
        <div className="navbar-buttons">
          {isAuthenticated ? (
            <UserButtons handleLogout={logout} />
          ) : (
            <>
              <button className="navbar-button" onClick={handleShowSignin} id="signinBtn">
                Registrarse
              </button>
              <button className="navbar-button" onClick={handleShowLogin} id="loginBtn">
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </nav>
      <SigninModal show={showSignin} handleClose={handleCloseSignin} />
      <LoginModal show={showLogin} handleClose={handleCloseLogin} />
    </>
  );
};

export default Navbar;

