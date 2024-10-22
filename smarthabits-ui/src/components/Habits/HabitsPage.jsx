import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HabitsPage.css";
import Navbar from "../Navbar/Navbar";
import CreateHabitButton from "./CreateHabitButton";
import HabitCard from "./HabitCard";

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState(""); // Estado para el nombre del usuario
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener hábitos y nombre del usuario al mismo tiempo
  const fetchData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("No token found, please log in.");
      return;
    }

    try {
      setIsLoading(true);

      // Realiza ambas solicitudes al mismo tiempo
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

      // Establece los hábitos y el nombre del usuario en el estado
      setHabits(habitsResponse.data.data);
      setName(userResponse.data.data.name); // Guarda el nombre del usuario
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error("Request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener los datos al cargar la página
  useEffect(() => {
    fetchData();
  }, []);

  // Función para agregar un hábito recién creado a la lista
  const handleHabitCreated = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  return (
    <div>
      <Navbar />
      <div className="habits-page-container">
        <div className="title-section">
          <h1>¡Bienvenido(a) {name}!</h1> {/* Mostrar el nombre del usuario */}
        </div>

        <div className="buttons-container">
          <CreateHabitButton onHabitCreated={handleHabitCreated} />
          <button className="action-button">Progreso</button>
        </div>

        <div className="habits-section">
          <div className="habits-title-container">
            <h2 className="habits-title">HÁBITOS</h2>
          </div>
          {error && <p className="text-danger">{error}</p>}
          {isLoading && <p>Cargando hábitos...</p>}
          {!isLoading && (
            <div className="habits-grid">
              {habits && habits.length > 0 ? (
                habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    setHabits={setHabits}
                    setError={setError}
                    habits={habits}
                  />
                ))
              ) : (
                <p>No hay hábitos aún</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
