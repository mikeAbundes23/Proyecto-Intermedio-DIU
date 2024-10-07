import React, { useState } from 'react';
import './UserButtons.css';
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

      <Dropdown show={showDropdown} onToggle={toggleDropdown} align="end">
        <Dropdown.Toggle as="button" className="icon-button" onClick={toggleDropdown}>
          <img src={userIcon} alt="userconfig" className="icon" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/profile">Mi Perfil</Dropdown.Item>
          <Dropdown.Item href="/settings">Configuración</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserButtons;
