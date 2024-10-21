import React from "react";
import "./Habits.css";
import Navbar from "../Navbar/Navbar";
import habitIcon from "../../images/habit-icon.png";

const HabitsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="habits-page-container">
        {/* Title Section */}
        <div className="title-section">
          <h1>¡Bienvenido(a) &lt;nombre&gt;!</h1>
        </div>

        {/* Action Buttons */}
        <div className="buttons-container">
          <button className="action-button">Crear hábito</button>
          <button className="action-button">Progreso</button>
        </div>

        {/* Habits Section */}
        <div className="habits-section">
          <h2>HÁBITOS</h2>
          <div className="habits-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="habit-card">
                <img
                  src={habitIcon}
                  alt={`Hábito ${i + 1}`}
                  className="habit-icon"
                />
                <span className="habit-name">Hábito {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
