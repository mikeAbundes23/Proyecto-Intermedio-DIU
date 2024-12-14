import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importamos el archivo CSS
import "./HabitsPage.css";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el contexto
import { useUser } from '../../context/UserContext';
// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";
// Importamos el componente para el botón de crear hábito
import CreateHabitButton from "./CreateHabitButton";
// Importamos el componente para los cards de hábitos
import HabitCard from "./HabitCard";

const HabitsPage = () => {

  const navigate = useNavigate();

  // Estado para la lista de hábitos
  const [habits, setHabits] = useState([]);
  // Estado para los datos del usuario loggueado
  const { userData } = useUser();

  // Función para manejar el cambio de vista "Progreso de hábitos"
  const handleProgressClick = () => {
    navigate("/progress");
  };

  // Función para obtener los hábitos
  const fetchHabits = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const habitsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/habits/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(habitsResponse.data.data || []);
    } catch (error) {
      console.error("Error completo en fetchData: ", error);
      swalMessages.errorMessage(error.response?.data?.message);
    }
  };

  // Función para obtener los datos al cargar la página
  useEffect(() => {
    fetchHabits();
  }, []);

  // Función para manejar el agregar un hábito a la lista
  const handleHabitCreated = (newHabit) => {
    setHabits(prevHabits => {
      const updatedHabits = [...prevHabits, newHabit];
      return updatedHabits;
    });
  };

  // Función para manejar el eliminar un hábito de la lista
  const handleHabitDeleted = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  // Función para actualizar los hábitos de la lista
  const handleProgressUpdate = (habitId, newAchieved) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, achieved: newAchieved } : habit
    ));
  };

  return (
    
    <div>
      {/* Componente NavBar */}
      <Navbar />

      {/* Contenedor con lo demás de la vista */}
      <div className="habits-page-container">
        <div className="title-section">
          <h1>¡Bienvenido(a) {userData?.name || ''}!</h1> {/* Mostramos el nombre del usuario */}
        </div>

        {/* Sección con los botones */}
        <div className="buttons-container">
          <CreateHabitButton onHabitCreated={handleHabitCreated} />
          <button className="btn-primary progress-habits" onClick={handleProgressClick}>
            Progreso
          </button>
        </div>

        {/* Sección de los hábitos */}
        <div className="habits-section">
          <div className="habits-title-container">
            <h2 className="habits-title">HÁBITOS</h2>
          </div>
          
          <div className="habits-grid">
            {habits.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-habits">Todavía no tienes ningún hábito registrado</p>
              </div>
            ) : (
              habits.map((habit) => (
                <HabitCard
                  key={`habit-${habit.id}`}
                  habit={habit}
                  onDelete={handleHabitDeleted}
                  onUpdateProgress={handleProgressUpdate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;