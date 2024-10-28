import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";

// Importamos el archivo CSS
import "./ProgressGraphs.css";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProgressGraphs = ({ selectedCategory, selectedHabit, selectedDays }) => {
  // Estados necesarios para las gráficas
  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Cargando los datos...");

  // Función para actualizar los datos de las gráficas cuando 
  // cualquiera de los filtros cambia
  useEffect(() => {
    if (selectedHabit === "all") {
      fetchProgressByCategory();
    } else {
      fetchProgressByHabit();
    }
  }, [selectedCategory, selectedHabit, selectedDays]);

  // Función para obtener el progreso por categoría
  const fetchProgressByCategory = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    setIsLoading(true);
    setStatusMessage("Cargando los datos...");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/habits/progress/by-category/${selectedCategory}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data, habits_completed, habits_incopmleted } = response.data;

      if (!data || data.length === 0) {
        setStatusMessage("No hay hábitos disponibles en esta categoría")
        setBarData(null);
        setPieData(null);
        return;
      }

      // Preparamos los datos para la gráfica de barras
      const labels = data.map((item) => item.habit.habit);
      const completedData = data.map((item) => {
        const totalProgress = item.progress_array
          .slice(-selectedDays)
          .reduce((sum, value) => sum + value, 0);

        const averageProgress = totalProgress / item.progress_array.length;
        return averageProgress;
      });

      const goalData = data.map(() => 100); // Representamos el objetivo como 100%

      // Preparamos los datos para la gráfica de barras
      setBarData({
        labels,
        datasets: [
          {
            label: "Progreso (%)",
            data: completedData,
            backgroundColor: "#6599d1",
          },
          {
            label: "Objetivo (%)",
            data: goalData,
            backgroundColor: "#028391",
          },
        ],
      });

      // Preparamos los datos para la gráfica de pastel
      setPieData({
        labels: ["Completados", "Pendientes"],
        datasets: [
          {
            data: [habits_completed, habits_incopmleted],
            backgroundColor: ["#6599d1", "#028391"],
          },
        ],
      });

      setStatusMessage(null);
    } catch (error) {
      setStatusMessage("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      console.error("Error en fetchProgressByCategory: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para obtener el progreso por hábito
  const fetchProgressByHabit = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    setIsLoading(true);
    setStatusMessage("Cargando los datos...");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/habits/progress/${selectedHabit}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response.data;

      // Verificamos si el arreglo de progreso está presente
      if (!data || !data.progress_array) {
        setStatusMessage("No hay datos de progreso disponibles para este hábito");
        setBarData(null);
        setPieData(null);
        return;
      }

      const progressArray = data.progress_array.slice(-selectedDays);

      // Preparamos los datos para la gráfica de barras
      setBarData({
        labels: progressArray.map((_, i) => `Día ${i + 1}`),
        datasets: [
          {
            label: "Progreso (%)",
            data: progressArray,
            backgroundColor: "#028391",
          },
        ],
      });

      // Calculamos la completitud total del hábito seleccionado
      const totalProgress = progressArray.reduce(
        (sum, value) => sum + value,
        0
      );
      const averageCompletion = totalProgress / progressArray.length;

      // Preparamos los datos para la gráfica de pastel
      setPieData({
        labels: ["Progreso Promedio", "Pendiente"],
        datasets: [
          {
            data: [averageCompletion, 100 - averageCompletion],
            backgroundColor: ["#028391", "#82c7d1"],
          },
        ],
      });

      setStatusMessage(null);
    } catch (error) {
      setStatusMessage("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      console.error("Error en fetchProgressByHabit: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    // Sección de las gráficas
    <div className="progress-graphs-container">
      {/* Título */}
      <h2>Gráficos y Estadísticas</h2>
      {statusMessage ? (
        <p className="text-habits">{statusMessage}</p>
      ) : (
        // Gráficas
        <div className="graphs">
          {/* Gráfica de barras */}
          <div className="bar-graph">
            <h3>Progreso por Hábito</h3>
            <div className="chart-container">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          family: 'Montserrat',
                          size: 12
                        },
                        padding: 20
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        color: '#f0f0f0'
                      },
                      ticks: {
                        callback: (value) => `${value}%`,
                        font: {
                          family: 'Montserrat'
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        font: {
                          family: 'Montserrat'
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Gráfica de pastel */}
          <div className="pie-graph">
            <h3>Progreso General</h3>
            <div className="chart-container">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          family: 'Montserrat',
                          size: 12
                        },
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressGraphs;