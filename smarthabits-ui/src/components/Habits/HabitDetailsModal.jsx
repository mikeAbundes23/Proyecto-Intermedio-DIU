import React from "react";
import { Modal, Button, ProgressBar } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import "./HabitDetailsModal.css";

// Importamos los íconos (imágenes png)
import descriptionIcon from '../../images/description.png';
import repeatIcon from '../../images/repeat.png';
import calendarIcon from '../../images/calendar.png';
import categoryIcon from '../../images/category.png';

const HabitDetailsModal = ({
  habit,
  show,
  onClose,
  setHabits,
  habits,
}) => {
  if (!habit) return null; // Si no hay un hábito seleccionado, no mostrar nada

  // Función para eliminar un hábito
  const deleteHabit = async (id) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      // Usamos la nueva URL para eliminar el hábito
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/habits/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(habits.filter((habit) => habit.id !== id));
      onClose(); // Cerramos el modal después de eliminar
    } catch (err) {
      alert("Failed to delete habit. Please try again.");
      console.error("Error en deleteHabit: ", err);
    }
  };

  return (

    // Modal de 'Información' del hábito
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0">
        {/* Título del modal */}
        <Modal.Title>Información</Modal.Title> 
      </Modal.Header>

      <Modal.Body>
        {habit && (
          <>
            {/* Nombre del hábito */}
            <h4>{habit.habit}</h4>
            <br />
            
            <div className="row">
              <div className="col-6">
                {/* Descripción del hábito */}
                <div className="mb-3 info-item">
                  <img src={descriptionIcon} alt="descripcion" className="icon-description" />
                  <strong>Descripción</strong>
                  <br />
                  <span>{habit.description || "No disponible"}</span>
                </div>

                {/* Frecuencia del hábito */}
                <div className="mb-3 info-item">
                  <img src={calendarIcon} alt="frecuencia" className="icon-frequency" />
                  <strong>Frecuencia</strong>
                  <br />
                  <span>{habit.frequency_display || "No especificada"}</span>
                </div>
              </div>

              <div className="col-6">
                {/* Repeticiones del hábito */}
                <div className="mb-3 info-item">
                  <img src={repeatIcon} alt="repeticiones" className="icon-repeat" />
                  <strong>Repeticiones</strong>
                  <br />
                  <span>{habit.goal}</span>
                </div>

                {/* Categoría del hábito */}
                <div className="mb-3 info-item-category">
                  <img src={categoryIcon} alt="categoria" className="icon-category" />
                  <strong>Categoría</strong>
                  <br />
                  <span>{habit.category_display}</span>
                </div>
              </div>
            </div>
            
            {/* Barra de progreso del hábito */}
            <div className="mt-3 progress-container">
              <strong>Progreso</strong>
              <ProgressBar
                now={(habit.achieved / habit.goal) * 100}
                label={`${((habit.achieved / habit.goal) * 100).toFixed(0)}%`}
                className="mt-2"
              />
            </div>
          </>
        )}
      </Modal.Body>

      {/* Botón para eliminar el hábito */}
      <Modal.Footer className="border-0">
        <Button variant="danger" onClick={() => deleteHabit(habit.id)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HabitDetailsModal;