import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el archivo CSS
import "./HabitsPage.css";
// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";
// Importamos el componente para el botón de crear hábito
import CreateHabitButton from "./CreateHabitButton";
// Importamos el componente para los cards de hábitos
import HabitCard from "./HabitCard";

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState(""); // Estado para el nombre del usuario
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Función para manejar el cambio de vista "Progreso de hábitos"
  const handleProgressClick = () => {
    navigate("/progress"); // Redirige a la página de progreso
  };

  // Función para obtener hábitos y nombre del usuario al mismo tiempo
  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("No token found, please log in.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Realizamos ambas solicitudes al mismo tiempo
      const [habitsResponse, userResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/habits/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Establecemos los hábitos y el nombre del usuario en el estado
      setHabits(habitsResponse.data.data);
      setName(userResponse.data.data.name); // Guardamos el nombre del usuario
    } catch (error) {
      console.error("Error completo en fetchData: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener los datos al cargar la página
  useEffect(() => {
    fetchData();
  }, []);

  // Función para agregar un hábito recién creado a la lista
  const handleHabitCreated = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  // Función para mostrar los cards de hábitos del usuario
  const renderHabits = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (!habits || habits.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-habits">Todavía no tienes ningún hábito registrado</p>
        </div>
      );
    }

    return (

      <div className="habits-grid">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            setHabits={setHabits}
            habits={habits}
          />
        ))}
      </div>
    );
  };

  return (

    // Página Principal del Usuario
    <div>
      {/* Componente NavBar */}
      <Navbar />

      {/* Contenedor con lo demás de la vista */}
      <div className="habits-page-container">
        <div className="title-section">
          <h1>¡Bienvenido(a) {name}!</h1> {/* Mostramos el nombre del usuario */}
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
          {renderHabits()}
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;