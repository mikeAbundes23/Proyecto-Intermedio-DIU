import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import { BiChevronLeft } from "react-icons/bi";

// Importamos el archivo CSS
import "./ProgressPage.css";

// Importamos el contexto
import { useProgress } from '../../context/ProgressContext';

// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";

// Importamos el componente de los filtros
import FilterDropdown from "./FilterDropdown";

// Importamos los íconos (imágenes png)
import habitCompleteIcon from '../../images/percent.png';
import streakIcon from '../../images/fire.png';
import longStreakIcon from '../../images/star.png';

const progressItems = [
  { 
    icon: habitCompleteIcon,
    iconClass: "icon-percent",
    title: "Hábitos Completados",
    getValue: (data) => `${data.completedPercentage}%`,
    getProgress: (data) => data.completedPercentage,
    barClass: "progress-bar-one"
  },
  {
    icon: streakIcon,
    iconClass: "icon-fire",
    title: "Racha Actual",
    getValue: (data) => `${data.currentStreak} días`,
    getProgress: (data) => (data.currentStreak / 30) * 100,
    barClass: "progress-bar-two"
  },
  {
    icon: longStreakIcon,
    iconClass: "icon-star",
    title: "Racha más Larga",
    getValue: (data) => `${data.longestStreak} días`,
    getProgress: (data) => (data.longestStreak / 30) * 100,
    barClass: "progress-bar-three"
  }
];

const ProgressPage = () => {

  const navigate = useNavigate();
  // Estado de los datos que se obtienen de los filtros
  const { progressData, fetchProgressData } = useProgress();

  // Función para obtener datos del progreso del usuario
  useEffect(() => {
    fetchProgressData();
  }, []);

  return (
    
    <div>
      {/* Componente NavBar */}
      <Navbar />

      {/* Botón para regresar a la vista anterior */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <BiChevronLeft size={40} />
      </button>

      {/* Título de la página */}
      <div className="progress-section">
        <h2>Progreso de tus hábitos</h2>
        <br />

        {/* Encabezados */}
        {progressItems.map((item, index) => (
          <div className="progress-item" key={index}>
            <img src={item.icon} alt="..." className={item.iconClass} />
            <strong>{item.title}</strong>
            <h3>{item.getValue(progressData)}</h3>
            <ProgressBar>
              <div 
                className={item.barClass}
                style={{ width: `${item.getProgress(progressData)}%` }}
              />
            </ProgressBar>
          </div>
        ))}
        
        {/* Modal de los filtros */}
        <FilterDropdown />
      </div>
    </div>
  );
};

export default ProgressPage;