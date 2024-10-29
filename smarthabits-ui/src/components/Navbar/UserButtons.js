import React, { useState, useEffect } from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';

// Importamos los íconos (imágenes png)
import notificationsIcon from '../../images/notifications.png';
import userIcon from '../../images/user-logo.png';
import closeIcon from '../../images/close.png';
import descriptionIcon from '../../images/description.png';
import calendarIcon from '../../images/calendar.png';

// Importamos el archivo CSS
import './UserButtons.css';

const FREQUENCY_MAP = {
  'd': 'Diario',
  'w': 'Semanal',
  'm': 'Mensual'
};

const UserButtons = ({ handleLogout }) => {
  // Estados necesarios para controlar los botones en el navbar
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [randomNotification, setRandomNotification] = useState(null);

  // Función para manejar las notificaciones
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME))?.data || {};
    setNotifications(storedNotifications);

    // Verificamos si ya se mostró un recordatorio en esta sesión
    const reminderShown = localStorage.getItem('reminderShown');

    // Mostramos una notificación aleatoria si hay al menos una y no se ha mostrado aún
    if (Object.keys(storedNotifications).length > 0 && !reminderShown) {
      const randomKey = Object.keys(storedNotifications)[Math.floor(Math.random() * Object.keys(storedNotifications).length)];
      const notificationData = storedNotifications[randomKey];

      // Procesamos la notificación usando FREQUENCY_MAP
      const processedNotification = {
        title: randomKey,
        description: notificationData.description,
        message: notificationData.message,
        frequency: notificationData.frequency,
        // Usamos FREQUENCY_MAP para convertir el código a texto
        frequency_display: FREQUENCY_MAP[notificationData.frequency] || "No especificada"
      };

      setRandomNotification(processedNotification);
      setShowNotificationModal(true); // Mostrar el modal

      // Marcamos que ya se mostró el recordatorio
      localStorage.setItem('reminderShown', 'true');
    }
  }, []);

  // Limpiamos el indicador de recordatorio cuando se cierra sesión
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' && !e.newValue) {
        localStorage.removeItem('reminderShown');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Funciones para manejar los dropdowns (notificaciones y del usuario)
  const toggleNotificationsDropdown = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
    setShowUserDropdown(false); // Cierra el dropdown de usuario
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationsDropdown(false); // Cierra el dropdown de notificaciones
  };

  // Función para eliminar una notificación de la lista
  const handleDeleteNotification = (title) => {
    const updatedNotifications = { ...notifications };
    delete updatedNotifications[title];
    setNotifications(updatedNotifications);
    localStorage.setItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME, JSON.stringify({ data: updatedNotifications }));
  };

  // Función para cerrar el modal de las notificaciones
  const handleCloseModal = () => {
    setShowNotificationModal(false);
    localStorage.setItem('reminderShown', 'true');
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
        <Dropdown.Menu className='dropdown-notifications'>
          <div className="notifications-header">
            <span>Notificaciones</span>
            <span className="notification-count">{notificationCount}</span>
          </div>

          {Object.entries(notifications).map(([title, notificationData]) => (
            <div className="notification-item" key={title}>
              <div className="notification-content">
                <span className="notification-title">{title}</span>
                <span className="notification-message">{notificationData.message}</span>
              </div>
              <button className="delete-notification" onClick={() => handleDeleteNotification(title)}>
                <img src={closeIcon} alt='' className='icon-close'></img>
              </button>
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

      {/* Modal de Notificación Aleatoria */}
      <Modal show={showNotificationModal} onHide={handleCloseModal} centered className="notification-modal">
        <Modal.Header closeButton className='border-0'>
          <Modal.Title>Recordatorio</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4 className="habit-title">{randomNotification?.title}</h4>
          <br />

          <div className="mb-3 info-item">
            <img src={descriptionIcon} alt="descripcion" className="icon-description" />
            <strong>Descripción</strong>
            <br />
            <span>{randomNotification?.description}</span>
          </div>

          <div className="mb-3 info-item">
            <img src={calendarIcon} alt="frecuencia" className="icon-frequency" />
            <strong>Frecuencia</strong>
            <br />
            <span>{randomNotification?.frequency_display}</span>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button className="btn-primary" onClick={handleCloseModal}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserButtons;