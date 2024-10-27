import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

// Importamos el archivo CSS
import './UserButtons.css'

// Importamos los íconos (imágenes png)
import notificationsIcon from '../../images/notifications.png';
import userIcon from '../../images/user-logo.png';

const UserButtons = ({ handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false); // Para controlar la visibilidad del dropdown

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Alterna el estado del dropdown
  };

  return (

    // Dropdown de los botones para el logo del usuario en el navbar
    <div className='user-buttons'>
      <button className="icon-button">
        <img src={notificationsIcon} alt="notificaciones" className="icon-notifications" />
      </button>

      <Dropdown id="dropdown-user" show={showDropdown} onToggle={toggleDropdown} align="end">
        <Dropdown.Toggle as="div" className="icon-button" onClick={toggleDropdown}>
          <img src={userIcon} alt="userconfig" className="icon-user" />
        </Dropdown.Toggle>

        <Dropdown.Menu id='dropdown-user-menu'>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserButtons;