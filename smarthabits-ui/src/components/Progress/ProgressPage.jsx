import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./ProgressPage.css";
import Navbar from "../Navbar/Navbar";
import { BiChevronLeft } from "react-icons/bi";
import Spinner from "react-bootstrap/Spinner";
import FilterDropdown from "./FilterDropdown";

const ProgressPage = () => {
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Obtener datos del progreso del usuario
  useEffect(() => {
    const fetchProgressData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        setCompletedPercentage(userData.habits_completed || -1);
        setCurrentStreak(userData.data.ongoing_streak || -1);
        setLongestStreak(userData.data.longest_streak || -1);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // Función para manejar el clic en el botón de retroceso
  const handleGoBack = () => {
    navigate(-1); // Navega hacia la página anterior
  };

  return (
    <div>
      <Navbar />
      <button className="back-button" onClick={handleGoBack}>
        <BiChevronLeft size={48} /> {/* Tamaño ajustable */}
      </button>
      <div className="progress-section">
        <h2>Progreso de tus hábitos</h2>

        <div className="progress-item">
          <p>% Hábitos Completados</p>
          <h3>{completedPercentage}%</h3>
          <ProgressBar
            now={completedPercentage}
            style={{ backgroundColor: "#d3d3d3" }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${completedPercentage}%`,
                backgroundColor: "#00b4b4",
              }}
            ></div>
          </ProgressBar>
        </div>

        <div className="progress-item">
          <p>Racha Actual</p>
          <h3>{currentStreak} días</h3>
          <ProgressBar
            now={(currentStreak / 30) * 100}
            style={{ backgroundColor: "#d3d3d3" }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${(currentStreak / 30) * 100}%`,
                backgroundColor: "#f39c12",
              }}
            ></div>
          </ProgressBar>
        </div>

        <div className="progress-item">
          <p>Racha más Larga</p>
          <h3>{longestStreak} días</h3>
          <ProgressBar
            now={(longestStreak / 30) * 100}
            style={{ backgroundColor: "#d3d3d3" }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${(longestStreak / 30) * 100}%`,
                backgroundColor: "#1b3b6f",
              }}
            ></div>
          </ProgressBar>
        </div>

        {isLoading && (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        )}

        <FilterDropdown />
      </div>
    </div>
  );
};

export default ProgressPage;
