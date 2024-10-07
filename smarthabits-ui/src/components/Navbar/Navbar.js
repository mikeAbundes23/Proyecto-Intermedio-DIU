import React, {useState} from 'react';
import './Navbar.css';
import logo from '../../images/Icono.png'
import letras from '../../images/Letras.png'
import LoginModal from '../Modals/LoginModal';
import SigninModal from '../Modals/SignInModal'
import UserButtons from './UserButtons';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  const [showSignin, setShowSignin] = useState(false);
  const handleCloseSignin = () => setShowSignin(false);
  const handleShowSignin = () => setShowSignin(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogout = () => {
    setIsAuthenticated(false); // Cambiar el estado de autenticación al cerrar sesión
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
            <UserButtons handleLogout={handleLogout}/>
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
    <LoginModal show={showLogin} handleClose={handleCloseLogin} setIsAuthenticated={setIsAuthenticated} />
    </>
  );
};

export default Navbar;
