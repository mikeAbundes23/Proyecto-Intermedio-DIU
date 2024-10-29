import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import { BiChevronLeft } from "react-icons/bi";
import Spinner from "react-bootstrap/Spinner";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el archivo CSS
import "./ProgressPage.css";

// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";

// Importamos el componente de los filtros
import FilterDropdown from "./FilterDropdown";

// Importamos los íconos (imágenes png)
import habitCompleteIcon from '../../images/percent.png';
import streakIcon from '../../images/fire.png';
import longStreakIcon from '../../images/star.png';

const ProgressPage = () => {
  // Estados de los datos que se obtienen de los filtros
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Función para obtener datos del progreso del usuario
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

        // Obtenemos la respuesta de la solicitud
        const userData = response.data;

        // Validamos que los datos existan
        if (userData && userData.data) {
          // Establecemos los datos para las gráficas
          setCompletedPercentage(userData.habits_completed || -1);
          setCurrentStreak(userData.data.ongoing_streak || -1);
          setLongestStreak(userData.data.longest_streak || -1);
        } else {
          swalMessages.errorMessage("Hubo un problema al obtener la información del progreso");
        }
      } catch (error) {
        console.error("Error en fetchProgressData: ", error);
        swalMessages.errorMessage(
          error.response?.data?.message || 'Error al obtener la información del progreso Por favor, inténtalo más tarde'
        );
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

    // Página del progreso de los hábitos
    <div>
      {/* Componente NavBar */}
      <Navbar />

      {/* Botón para regresar a la vista anterior */}
      <button className="back-button" onClick={handleGoBack}>
        <BiChevronLeft size={40} />
      </button>

      {/* Título de la página */}
      <div className="progress-section">
        <h2>Progreso de tus hábitos</h2>
        <br />

        {/* Encabezados */}
        <div className="progress-item">
          <img src={habitCompleteIcon} alt="completados" className="icon-percent" />
          <strong>Hábitos Completados</strong>
          <h3>{completedPercentage}%</h3>
          
          <ProgressBar
            now={completedPercentage}
            style={{ backgroundColor: "#d1d1d1" }}
          >
            <div
              className="progress-bar-one"
              style={{
                width: `${completedPercentage}%`
              }}
            ></div>
          </ProgressBar>
        </div>

        <div className="progress-item">
          <img src={streakIcon} alt="racha actual" className="icon-fire" />
          <strong>Racha Actual</strong>
          <h3>{currentStreak} días</h3>

          <ProgressBar
            now={(currentStreak / 30) * 100}
            style={{ backgroundColor: "#d1d1d1" }}
          >
            <div
              className="progress-bar-two"
              style={{
                width: `${(currentStreak / 30) * 100}%`
              }}
            ></div>
          </ProgressBar>
        </div>

        <div className="progress-item">
          <img src={longStreakIcon} alt="racha mas larga" className="icon-star" />
          <strong>Racha más Larga</strong>
          <h3>{longestStreak} días</h3>

          <ProgressBar
            now={(longestStreak / 30) * 100}
            style={{ backgroundColor: "#d1d1d1" }}
          >
            <div
              className="progress-bar-three"
              style={{
                width: `${(longestStreak / 30) * 100}%`
              }}
            ></div>
          </ProgressBar>
        </div>

        <br />
        {/* Ruedita para mostrar que se están cargando los datos */}
        {isLoading && (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        )}
        
        {/* Modal de los filtros */}
        <FilterDropdown />
      </div>
    </div>
  );
};

export default ProgressPage;