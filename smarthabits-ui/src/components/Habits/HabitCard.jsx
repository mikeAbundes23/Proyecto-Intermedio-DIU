import React, { useState } from "react";
import axios from "axios";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import habitIcon from "../../images/routine.png";
import HabitDetailsModal from "./HabitDetailsModal";

const HabitCard = ({ habit, onDelete, onUpdateProgress }) => {
  
  // Estado para el modal de detalles
  const [showModal, setShowModal] = useState(false);

  // Función para actualizar el progreso de un hábito en el backend
  const updateHabitProgress = async (newAchieved) => {
    if (!habit.id || newAchieved === undefined) return;

    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/habits/update/progress/${habit.id}/`,
        { achieved: newAchieved },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Si la actualización fue exitosa, actualizamos el estado en el componente padre
      onUpdateProgress(habit.id, newAchieved);
    } catch (error) {
      console.error("Error en updateHabitProgress: ", error);
      swalMessages.errorMessage(error.response?.data?.message);
    }
  };

  // Función para incrementar el progreso de un hábito
  const incrementHabit = () => {
    if (habit.achieved === undefined) return;
    updateHabitProgress(habit.achieved + 1);
  };

  // Función para decrementar el progreso de un hábito
  const decrementHabit = () => {
    if (habit.achieved === undefined || habit.achieved <= 0) return;
    updateHabitProgress(habit.achieved -1);
  };

  // Si no hay hábito válido, no renderizamos nada
  if (!habit || !habit.id) return null;

  return (

    // Con esto vemos de qué color se debe mostrar el card dependiendo de si
    // ya se completó el hábito
    <div className={`habit-card ${habit.achieved >= habit.goal ? "completed" : ""}`}>

      {/* Título de Objetivo */}
      <div className="habit-info">
        <span className="habit-goal">Objetivo: {habit.goal}</span>
        <br />
        {/* Nombre e ícono del hábito */}
        <img src={habitIcon} alt="..." />
        <span className="habit-name">{habit.habit}</span>
      </div>

      {/* Mostramos los datos del card del hábito */}
      <div className="habit-progress">
        <button onClick={decrementHabit}>-</button>
        <span>{habit.achieved}</span>
        <button onClick={incrementHabit}>+</button>
      </div>

      {/* Botón de Ver detalles */}
      <button
        className="btn-secondary"
        onClick={() => setShowModal(true)}
      >
        Ver detalles
      </button>

      {/* Modal de detalles del hábito */}
      <HabitDetailsModal
        habit={habit}
        show={showModal}
        onClose={() => setShowModal(false)}
        onDelete={onDelete}
      />
    </div>
  );
};

export default HabitCard;