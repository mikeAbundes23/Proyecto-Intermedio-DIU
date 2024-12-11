import React, { useState, useEffect } from "react";
import { Accordion, Button, Dropdown } from "react-bootstrap";

// Importamos el archivo CSS
import "./FilterDropdown.css";

// Importamos el contexto
import { useProgress } from "../../context/ProgressContext";

// Importamos el componente para mostrar las gráficas
import ProgressGraphs from "./ProgressGraphs";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import filterIcon from "../../images/filter.png";
import calendarIcon from '../../images/calendar.png';

// Lista de categorías disponibles
const CATEGORIES = {
  all: "Todas las categorías",
  school: "Escuela",
  work: "Trabajo",
  sports: "Deporte",
  cleaning: "Limpieza",
  leisure: "Ocio",
  other: "Otro"
};

const FilterDropdown = () => {

  const { progressData, setProgressData } = useProgress();
  // Estado para controlar la visualización de las gráficas
  const [showGraphs, setShowGraphs] = useState(false);

  // Estado para los filtros aplicados
  const [filters, setFilters] = useState({
    days: 7,
    category: "all",
    habit: "all"
  });

  // Función para actualizar los hábitos filtrados cuando cambia la categoría
  useEffect(() => {
    if (filters.category === "all") {
      setProgressData(prev => ({
        ...prev,
        filteredHabits: progressData.habits
      }));
    } else {
      const filtered = progressData.habits.filter(habit => habit.category === filters.category);
      setProgressData(prev => ({
        ...prev,
        filteredHabits: filtered
      }));
      // Si el hábito seleccionado no está en la categoría filtrada, reseteamos la selección
      if (filters.habit !== "all" && !filtered.find(h => h.id === filters.habit)) {
        setFilters(prev => ({ ...prev, habit: "all" }));
      }
    }
  }, [filters.category, progressData.habits]);

  // Función para manejar el cambio en los filtros
  const handleFilterChange = (type, value) => {
    setShowGraphs(false);
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Función para aplicar los filtros cuando se presiona el botón
  const handleApplyFilters = () => {
    if (filters.habit !== "all" && !progressData.filteredHabits.find(h => h.id === filters.habit)) {
      swalMessages.errorMessage("El hábito seleccionado ya no está disponible");
      return;
    }

    if (filters.category !== "all" && progressData.filteredHabits.length === 0) {
      swalMessages.errorMessage("No hay hábitos en la categoría seleccionada");
      return;
    }

    setShowGraphs(true);
  };

  return (
    
    <div className="filter-dropdown-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="filter-button-header">
            {/* Encabezado */}
            <img src={filterIcon} alt="..." className="icon-filter" />
            <h2>Filtros</h2>
          </Accordion.Header>

          <Accordion.Body>
            {/* Texto y Botones de Rango de Fechas */}
            <strong>Rango de Fechas</strong>
            <div className="days-buttons">
              {[7, 15, 30].map(days => (
                <button
                  key={days}
                  className={`days-button ${filters.days === days ? "active" : ""}`}
                  onClick={() => handleFilterChange('days', days)}
                >
                  <img src={calendarIcon} alt="..." className="icon-calendar" />
                  <span>{days} días</span>
                </button>
              ))}
            </div>

            {/* Texto y Dropdown de Categoría */}
            <strong>Categoría</strong>
            <Dropdown className="filter-dropdown mb-3">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-category"
                className="dropdown-toggle-custom"
              >
                {CATEGORIES[filters.category]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Object.entries(CATEGORIES).map(([id, label]) => (
                  <Dropdown.Item
                    key={id}
                    onClick={() => handleFilterChange('category', id)}
                  >
                    {label}
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
                {filters.habit === "all" 
                  ? "Todos los hábitos" 
                  : progressData.filteredHabits.find(h => h.id === filters.habit)?.habit || "Todos los hábitos"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleFilterChange('habit', 'all')}>
                  Todos los hábitos
                </Dropdown.Item>

                {progressData.filteredHabits.map((habit) => (
                  <Dropdown.Item
                    key={habit.id}
                    onClick={() => handleFilterChange('habit', habit.id)}
                  >
                    {habit.habit}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Botón para ver las gráficas */}
            <div className="view-graphs-container">
              <Button 
                className="btn-primary" 
                onClick={handleApplyFilters} 
                disabled={progressData.habits.length === 0}
              >
                Ver gráficas
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Sección de las gráficas */}
      {showGraphs && (
        <ProgressGraphs
          selectedCategory={filters.category}
          selectedHabit={filters.habit}
          selectedDays={filters.days}
        />
      )}
    </div>
  );
};

export default FilterDropdown;