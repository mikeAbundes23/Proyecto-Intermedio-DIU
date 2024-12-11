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

// Importamos el contexto
import { useProgress } from "../../context/ProgressContext";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartOptions = {
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
};

const barChartOptions = {
  ...chartOptions,
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
};

const ProgressGraphs = ({ selectedCategory, selectedHabit, selectedDays }) => {
  
  const { progressData } = useProgress();

  // Estado necesario para las gráficas
  const [chartData, setChartData] = useState({
    bar: null,
    pie: null
  });

  const [statusMessage, setStatusMessage] = useState(null);

  // Función para aplicar los filtros obtenidos en las gráficas
  const fetchProgress = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      if (selectedHabit === "all") {
        await fetchProgressByCategory(token);
      } else {
        await fetchProgressByHabit(token);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setStatusMessage("Error al cargar los datos.<br>Por favor, inténtalo de nuevo.");
      setChartData({ bar: null, pie: null });
    }
  };

  // Función para obtener el progreso por categoría
  const fetchProgressByCategory = async (token) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/habits/progress/by-category/${selectedCategory}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { data, habits_completed, habits_incompleted } = response.data;

    if (!data?.length) {
      setStatusMessage("No hay hábitos disponibles")
      setChartData({ bar: null, pie: null });
      return;
    }

    // Preparamos los datos para la gráfica de barras
    const labels = data.map((item) => item.habit.habit);
    const completedData = data.map(item => {
      const totalProgress = item.progress_array
        .slice(-selectedDays)
        .reduce((sum, value) => sum + value, 0);

      const averageProgress = totalProgress / item.progress_array.length;
      return averageProgress;
    });

    // Asignamos los datos para las gráficas
    setChartData({
      bar: {
        labels,
        datasets: [
          {
            label: "Progreso (%)",
            data: completedData,
            backgroundColor: "#6599d1",
          },
          {
            label: "Objetivo (%)",
            data: data.map(() => 100),
            backgroundColor: "#028391",
          },
        ],
      },
      pie: {
        labels: ["Completados", "Pendientes"],
        datasets: [{
          data: [habits_completed, habits_incompleted],
          backgroundColor: ["#6599d1", "#028391"],
        }],
      }
    });

    setStatusMessage(null);
  };

  // Función para obtener el progreso por hábito
  const fetchProgressByHabit = async (token) => {
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
    if (!data?.progress_array) {
      setStatusMessage("No hay datos de progreso disponibles para este hábito");
      setChartData({ bar: null, pie: null });
      return;
    }

    const progressArray = data.progress_array.slice(-selectedDays);
    const totalProgress = progressArray.reduce((sum, value) => sum + value, 0);
    const averageCompletion = totalProgress / progressArray.length;

    setChartData({
      bar: {
        labels: progressArray.map((_, i) => `Día ${i + 1}`),
        datasets: [{
          label: "Progreso (%)",
          data: progressArray,
          backgroundColor: "#028391",
        }],
      },
      pie: {
        labels: ["Progreso Promedio", "Pendiente"],
        datasets: [{
          data: [averageCompletion, 100 - averageCompletion],
          backgroundColor: ["#028391", "#82c7d1"],
        }],
      }
    });

    setStatusMessage(null);
  };

  // Función para actualizar los datos de las gráficas cuando 
  // cualquiera de los filtros cambia
  useEffect(() => {
    if (progressData.habits.length > 0) {
      fetchProgress();
    }
  }, [selectedCategory, selectedHabit, selectedDays, progressData.habits]);

  return (
    
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
              {chartData.bar && (
                <Bar 
                  data={chartData.bar}
                  options={barChartOptions}
                />
              )}
            </div>
          </div>

          {/* Gráfica de pastel */}
          <div className="pie-graph">
            <h3>Progreso General</h3>
            <div className="chart-container">
              {chartData.pie && (
                <Pie 
                  data={chartData.pie}
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressGraphs;