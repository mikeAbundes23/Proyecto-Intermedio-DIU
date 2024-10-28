import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import notificationsIcon from '../../images/notifications.png';
import userIcon from '../../images/user-logo.png';
import './UserButtons.css';

const UserButtons = ({ handleLogout }) => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME))?.data || {};
    setNotifications(storedNotifications);
  }, []);

  const toggleNotificationsDropdown = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
    setShowUserDropdown(false); // Cierra el dropdown de usuario
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationsDropdown(false); // Cierra el dropdown de notificaciones
  };

  const handleDeleteNotification = (title) => {
    const updatedNotifications = { ...notifications };
    delete updatedNotifications[title];
    setNotifications(updatedNotifications);
    localStorage.setItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME, JSON.stringify({ data: updatedNotifications }));
  };

  const notificationCount = Object.keys(notifications).length;

  return (
    <div className='user-buttons'>
      {/* Botón de Notificaciones */}
      <button className="icon-button" onClick={toggleNotificationsDropdown}>
        <img src={notificationsIcon} alt="notificaciones" className="icon-notifications" />
        {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>} 
      </button>

      {/* Dropdown de Notificaciones */}
      <Dropdown id="dropdown-notifications" show={showNotificationsDropdown}>
        <Dropdown.Menu>
          <div className="notifications-header">
            <span>Notificaciones</span>
            <span className="notification-count">{notificationCount}</span>
          </div>

          {Object.entries(notifications).map(([title, message]) => (
            <div className="notification-item" key={title}>
              <div className="notification-content">
                <span className="notification-title">{title}</span>
                <span className="notification-message">{message}</span>
              </div>
              <button className="delete-notification" onClick={() => handleDeleteNotification(title)}>✖</button>
            </div>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Botón de Usuario */}
      <Dropdown id="dropdown-user" show={showUserDropdown} align="end">
        <Dropdown.Toggle as="div" className="icon-button" onClick={toggleUserDropdown}>
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
