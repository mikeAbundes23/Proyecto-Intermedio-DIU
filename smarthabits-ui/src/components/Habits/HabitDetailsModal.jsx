import React from "react";
import { Modal, Button, ProgressBar } from "react-bootstrap";
import "./HabitDetailsModal.css"; // Importa el CSS para estilos
import axios from "axios";

const HabitDetailsModal = ({
  habit,
  show,
  onClose,
  setHabits,
  habits,
  setError,
}) => {
  if (!habit) return null; // Si no hay un hábito seleccionado, no mostrar nada

  // Función para eliminar un hábito
  const deleteHabit = async (id) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    try {
      // Usar la nueva URL para eliminar el hábito
      await axios.delete(`http://127.0.0.1:8000/api/habits/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(habits.filter((habit) => habit.id !== id));
      onClose(); // Cerrar el modal después de eliminar
    } catch (err) {
      setError("Failed to delete habit. Please try again.");
      console.error("Error in deleteHabit:", err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Información</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {habit && (
          <>
            <h4>{habit.habit}</h4>
            <p>
              <strong>Descripción:</strong>{" "}
              {habit.description || "No disponible"}
            </p>
            <p>
              <strong>Repeticiones:</strong> {habit.goal}
            </p>
            <p>
              <strong>Frecuencia:</strong>{" "}
              {habit.frequency || "No especificada"}
            </p>
            <p>
              <strong>Categoría:</strong> {habit.category}
            </p>
            <div className="progress-container">
              <ProgressBar
                now={(habit.achieved / habit.goal) * 100}
                label={`${((habit.achieved / habit.goal) * 100).toFixed(0)}%`}
              />
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => deleteHabit(habit.id)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HabitDetailsModal;
