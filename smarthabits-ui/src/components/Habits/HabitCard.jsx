import React from "react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import habitIcon from "../../images/routine.png";
import HabitDetailsModal from "./HabitDetailsModal";

const HabitCard = ({ habit, setHabits, habits }) => {
  // Estados para el modal de detalles
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para abrir el modal de detalles
  const openDetailsModal = (habit) => {
    setSelectedHabit(habit);
    setShowModal(true);
  };

  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setSelectedHabit(null);
    setShowModal(false);
  };

  // Función para incrementar el progreso de un hábito
  const incrementHabit = (habit) => {
    const newAchieved = habit.achieved + 1;
    updateHabitProgress(habit.id, newAchieved);
  };

  // Función para decrementar el progreso de un hábito
  const decrementHabit = (habit) => {
    if (habit.achieved > 0) {
      const newAchieved = habit.achieved - 1;
      updateHabitProgress(habit.id, newAchieved);
    }
  };

  // Función para actualizar el progreso de un hábito en el backend
  const updateHabitProgress = async (id, newAchieved) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/habits/update/progress/${id}/`,
        { achieved: newAchieved },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Comprobamos si la respuesta obtenida es la esperada
      if (response.data.message === "Progreso actualizado correctamente") {
        setHabits(
          habits.map((habit) =>
            habit.id === id ? { ...habit, achieved: newAchieved } : habit
          )
        );
      } else {
        swalMessages.errorMessage("Hubo un problema al actualizar el progreso");
      }
    } catch (err) {
      console.error("Error en updateHabitProgress: ", err);
      swalMessages.errorMessage(
        err.response?.data?.message || "Error al actualizar el progreso. Por favor, inténtalo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (

    // Con esto vemos de qué color se debe mostrar el card dependiendo de si
    // ya se completó el hábito
    <div
      key={habit.id}
      className={`habit-card ${
        habit.achieved >= habit.goal ? "completed" : ""
      }`}
    >
      {/* Título de Objetivo */}
      <div className="habit-info">
        <span className="habit-goal">Objetivo: {habit.goal}</span>
        <br />
        {/* Nombre e ícono del hábito */}
        <img src={habitIcon} alt="Habit icon" />
        <span className="habit-name">{habit.habit}</span>
      </div>
      {/* Mostramos que se están cargando los datos */}
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        // Mostramos los datos del card del hábito
        <>
          <div className="habit-progress">
            <button onClick={() => decrementHabit(habit)}>-</button>
            <span>{habit.achieved}</span>
            <button onClick={() => incrementHabit(habit)}>+</button>
          </div>
        </>
      )}

      {/* Botón de Ver detalles */}
      <button
        className="details-button"
        onClick={() => openDetailsModal(habit)}
      >
        Ver detalles
      </button>

      {/* Modal de detalles del hábito */}
      <HabitDetailsModal
        habit={selectedHabit}
        show={showModal}
        onClose={closeDetailsModal}
        setHabits={setHabits}
        habits={habits}
      />
    </div>
  );
};

export default HabitCard;