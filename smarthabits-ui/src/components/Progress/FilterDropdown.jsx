import React, { useState, useEffect } from "react";
import { Accordion, Dropdown } from "react-bootstrap";
import { FiCalendar } from "react-icons/fi"; // Importar ícono de calendario
import "./FilterDropdown.css";
import ProgressGraphs from "./ProgressGraphs";

const FilterDropdown = () => {
  const [selectedDays, setSelectedDays] = useState("7 días");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHabit, setSelectedHabit] = useState("all");
  const [habits, setHabits] = useState([]);

  // Manejar el cambio de filtros
  const handleDaysChange = (days) => setSelectedDays(days);
  const handleCategoryChange = (category) => setSelectedCategory(category);

  const handleHabitSelection = (habit) => setSelectedHabit(habit.id);

  // Obtener la lista de hábitos del usuario
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/habits/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data?.data?.length > 0) {
        setHabits(data.data); // Guardar los hábitos en el estado
      }
    } catch (error) {
      console.error("Error al obtener la lista de hábitos:", error);
    }
  };

  return (
    <div className="filter-dropdown-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="filter-button-header">
            <FiCalendar size={20} style={{ marginRight: "8px" }} />
            Filtros
          </Accordion.Header>
          <Accordion.Body>
            <h3 className="filter-title">Filtros</h3>

            {/* Botones de rango de fechas */}
            <div className="days-buttons">
              <button
                className={`days-button ${
                  selectedDays === "7 días" ? "active" : ""
                }`}
                onClick={() => handleDaysChange("7 días")}
              >
                <FiCalendar className="icon-calendar" />7 días
              </button>
              <button
                className={`days-button ${
                  selectedDays === "15 días" ? "active" : ""
                }`}
                onClick={() => handleDaysChange("15 días")}
              >
                <FiCalendar className="icon-calendar" />
                15 días
              </button>
              <button
                className={`days-button ${
                  selectedDays === "30 días" ? "active" : ""
                }`}
                onClick={() => handleDaysChange("30 días")}
              >
                <FiCalendar className="icon-calendar" />
                30 días
              </button>
            </div>

            {/* Texto y Dropdown de Categoría */}
            <p className="filter-label">Categorías</p>
            <Dropdown className="filter-dropdown mb-3">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-category"
                className="dropdown-toggle-custom"
              >
                {selectedCategory}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleCategoryChange("all")}>
                  all
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleCategoryChange("Ejercicio")}
                >
                  Ejercicio
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategoryChange("Lectura")}>
                  Lectura
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleCategoryChange("Meditación")}
                >
                  Meditación
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategoryChange("Estudio")}>
                  Estudio
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCategoryChange("Dieta")}>
                  Dieta
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Texto y Dropdown de Hábito */}
            <p className="filter-label">Hábito Específico</p>
            <Dropdown className="filter-dropdown mb-3">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-habit"
                className="dropdown-toggle-custom"
              >
                {selectedHabit}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {habits.length > 0 ? (
                  habits.map((habit) => (
                    <Dropdown.Item
                      key={habit.id}
                      onClick={() => handleHabitSelection(habit)}
                    >
                      {habit.habit}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>
                    No hay hábitos disponibles
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Botón para ver gráficas */}
            {/* <div className="view-graphs-container">
              <Button className="view-graphs-button">Ver gráficas</Button>
            </div> */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <ProgressGraphs
        selectedCategory={selectedCategory}
        selectedHabit={selectedHabit}
      />
    </div>
  );
};

export default FilterDropdown;
