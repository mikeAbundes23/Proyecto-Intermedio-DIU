import React, { useState, useEffect } from "react";
import { Accordion, Button, Dropdown } from "react-bootstrap";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el archivo CSS
import "./FilterDropdown.css";

// Importamos los íconos (imágenes png)
import filterIcon from "../../images/filter.png";
import calendarIcon from '../../images/calendar.png';

// Importamos el componente para mostrar las gráficas
import ProgressGraphs from "./ProgressGraphs";

// Objeto para manejar las traducciones de categorías
const categoryTranslations = {
  all: "Todas las categorías",
  school: "Escuela",
  work: "Trabajo",
  sports: "Deporte",
  cleaning: "Limpieza",
  leisure: "Ocio",
  other: "Otro"
};

// Lista de categorías disponibles
const categories = [
  { id: "all", label: "Todas las categorías" },
  { id: "school", label: "Escuela" },
  { id: "work", label: "Trabajo" },
  { id: "sports", label: "Deporte" },
  { id: "cleaning", label: "Limpieza" },
  { id: "leisure", label: "Ocio" },
  { id: "other", label: "Otro" }
];

const FilterDropdown = () => {
  // Estados para los filtros seleccionados
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHabit, setSelectedHabit] = useState("all");
  const [habits, setHabits] = useState([]);

  // Estado para controlar la visualización de las gráficas
  const [showGraphs, setShowGraphs] = useState(false);

  // Estado para los filtros aplicados
  const [appliedFilters, setAppliedFilters] = useState({
    days: 7,
    category: "all",
    habit: "all"
  });

  // Funciones para manejar el cambio de filtros
  const handleDaysChange = (days) => {
    setSelectedDays(days);
    setShowGraphs(false); // Ocultamos las gráficas cuando se cambian los filtros
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== "all") {
      const habitInCategory = habits.find(
        h => h.id === selectedHabit && h.category === category
      );
      if (!habitInCategory) {
        setSelectedHabit("all");
      }
    }
    setShowGraphs(false);
  };

  const handleHabitSelection = (habit) => {
    // Si recibimos el string "all", lo usamos directamente
    if (habit === "all") {
      setSelectedHabit("all");
    } else {
      // Si recibimos un objeto hábito, usamos su id
      setSelectedHabit(habit.id);
    }
    setShowGraphs(false);
  };

  // Función para aplicar los filtros cuando se presiona el botón
  const handleApplyFilters = () => {
    // Validamos que haya hábitos disponibles si se seleccionó un hábito específico
    if (selectedHabit !== "all" && !habits.find(h => h.id === selectedHabit)) {
      swalMessages.errorMessage("El hábito seleccionado ya no está disponible");
      return;
    }

    // Validamos que haya hábitos en la categoría seleccionada
    if (selectedCategory !== "all" && !habits.some(h => h.category === selectedCategory)) {
      swalMessages.errorMessage("No hay hábitos en la categoría seleccionada");
      return;
    }

    setAppliedFilters({
      days: selectedDays,
      category: selectedCategory,
      habit: selectedHabit
    });
    setShowGraphs(true); // Mostramos las gráficas solo cuando se presiona el botón
  };

  // Función para manejar la lista de hábitos del usuario
  useEffect(() => {
    fetchHabits();
  }, []);

  // Función para obtener la lista de hábitos
  const fetchHabits = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/habits/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data?.data?.length > 0) {
        setHabits(data.data); // Guardamos los hábitos en el estado
        if (data.data.length === 0) {
          swalMessages.errorMessage("No hay hábitos disponibles para mostrar");
        }
      } else {
        swalMessages.errorMessage(
          data?.message || "Hubo un problema al obtener la lista de hábitos"
        );
      }
    } catch (error) {
      console.error("Error en fetchHabits: ", error);
      swalMessages.errorMessage(
        error.response?.data?.message || "Error al obtener la lista de hábitos Por favor, inténtalo más tarde"
      );
    }
  };

  return (

    // Modal de los filtros
    <div className="filter-dropdown-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="filter-button-header">
            {/* Encabezado */}
            <img src={filterIcon} alt="filtros" className="icon-filter" />
            <h2>Filtros</h2>
          </Accordion.Header>

          <Accordion.Body>
            {/* Texto y Botones de Rango de Fechas */}
            <strong>Rango de Fechas</strong>
            <div className="days-buttons">
              <button
                className={`days-button ${selectedDays === 7 ? "active" : ""}`}
                onClick={() => handleDaysChange(7)}
              >
                <img src={calendarIcon} alt="" className="icon-calendar" />
                <span>7 días</span>
              </button>

              <button
                className={`days-button ${selectedDays === 15 ? "active" : ""}`}
                onClick={() => handleDaysChange(15)}
              >
                <img src={calendarIcon} alt="" className="icon-calendar" />
                <span>15 días</span>
              </button>

              <button
                className={`days-button ${selectedDays === 30 ? "active" : ""}`}
                onClick={() => handleDaysChange(30)}
              >
                <img src={calendarIcon} alt="" className="icon-calendar" />
                <span>30 días</span>
              </button>
            </div>

            {/* Texto y Dropdown de Categoría */}
            <strong>Categoría</strong>
            <Dropdown className="filter-dropdown mb-3">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-category"
                className="dropdown-toggle-custom"
              >
                {categoryTranslations[selectedCategory]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {categories.map(category => (
                  <Dropdown.Item
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Texto y Dropdown de Hábito */}
            <strong>Hábito Específico</strong>
            <Dropdown className="filter-dropdown mb-3">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-habit"
                className="dropdown-toggle-custom"
              >
                {selectedHabit === "all" ? "Todos los hábitos" : habits.find(h => h.id === selectedHabit)?.habit || "Todos los hábitos"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleHabitSelection("all")}>
                  Todos los hábitos
                </Dropdown.Item>

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

            {/* Botón para ver las gráficas */}
            <div className="view-graphs-container">
              <Button className="view-graphs-button" onClick={handleApplyFilters}>Ver gráficas</Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Sección de las gráficas */}
      {showGraphs && (
        <ProgressGraphs
          selectedCategory={appliedFilters.category}
          selectedHabit={appliedFilters.habit}
          selectedDays={appliedFilters.days}
        />
      )}
    </div>
  );
};

export default FilterDropdown;