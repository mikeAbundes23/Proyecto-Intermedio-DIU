import React, { useState } from 'react';
import './UserButtons.css'
import notificationsIcon from '../../images/notifications.png';
import userIcon from '../../images/user-logo.png';
import { Dropdown } from 'react-bootstrap'; // Importamos Dropdown de react-bootstrap

const UserButtons = ({ handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false); // Para controlar la visibilidad del dropdown

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Alterna el estado del dropdown
  };

  return (
    <div className='user-buttons'>
      <button className="icon-button">
        <img src={notificationsIcon} alt="notificaciones" className="icon" />
      </button>

      <Dropdown id="dropdown-user" show={showDropdown} onToggle={toggleDropdown} align="end">
        <Dropdown.Toggle as="div" className="icon-button" onClick={toggleDropdown}>
          <img src={userIcon} alt="userconfig" className="icon" />
        </Dropdown.Toggle>

        <Dropdown.Menu id='dropdown-user-menu'>
          <Dropdown.Item href="/">Mi Perfil</Dropdown.Item>
          <Dropdown.Item href="/">Configuración</Dropdown.Item>
          <Dropdown.Divider id="dropdown-divider"/>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserButtons;
