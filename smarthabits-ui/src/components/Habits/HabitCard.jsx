import React from "react";
import habitIcon from "../../images/habit-icon.png";
import HabitDetailsModal from "./HabitDetailsModal";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

const HabitCard = ({ habit, setHabits, setError, habits }) => {
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
    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    try {
      setIsLoading(true);
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

      if (response.data.message === "Progreso actualizado correctamente") {
        setHabits(
          habits.map((habit) =>
            habit.id === id ? { ...habit, achieved: newAchieved } : habit
          )
        );
      }
    } catch (err) {
      setError("Failed to update progress. Please try again.");
      console.error("Error in updateHabitProgress:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={habit.id}
      className={`habit-card ${
        habit.achieved >= habit.goal ? "completed" : ""
      }`}
    >
      <div className="habit-info">
        <span className="habit-goal">Objetivo: {habit.goal}</span>
        <br />
        <img src={habitIcon} alt="Habit icon" />
        <span className="habit-name">{habit.habit}</span>
      </div>

      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <div className="habit-progress">
            <button onClick={() => decrementHabit(habit)}>-</button>
            <span>{habit.achieved}</span>
            <button onClick={() => incrementHabit(habit)}>+</button>
          </div>
        </>
      )}

      <button
        className="details-button"
        onClick={() => openDetailsModal(habit)}
      >
        Ver detalles
      </button>

      {/* Modal de Detalles del Hábito */}
      <HabitDetailsModal
        habit={selectedHabit}
        show={showModal}
        onClose={closeDetailsModal}
        setHabits={setHabits}
        habits={habits}
        setError={setError}
      />
    </div>
  );
};

export default HabitCard;
