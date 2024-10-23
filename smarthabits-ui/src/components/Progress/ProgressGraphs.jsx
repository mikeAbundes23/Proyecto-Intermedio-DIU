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
import "./ProgressGraphs.css";

// Register the required components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProgressGraphs = ({ selectedCategory, selectedHabit }) => {
  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedHabit === "all") {
      fetchProgressByCategory();
    } else {
      fetchProgressByHabit();
    }
  }, [selectedCategory, selectedHabit]);

  // Función para obtener el progreso por categoría
  const fetchProgressByCategory = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/habits/progress/by-category/${selectedCategory}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data, habits_completed, habits_incopmleted } = response.data;

      if (!data || data.length === 0) {
        console.error("No hay datos disponibles por categoría.");
        setIsLoading(false);
        return;
      }

      // Preparar datos para la gráfica de barras
      const labels = data.map((item) => item.habit.habit);
      const completedData = data.map((item) => {
        // Calculate average progress
        const totalProgress = item.progress_array.reduce(
          (sum, value) => sum + value,
          0
        );
        const averageProgress = totalProgress / item.progress_array.length;
        return averageProgress;
      });
      const goalData = data.map(() => 100); // Representar el objetivo como 100%

      setBarData({
        labels,
        datasets: [
          {
            label: "Progreso (%)",
            data: completedData,
            backgroundColor: "#028391",
          },
          {
            label: "Objetivo (%)",
            data: goalData,
            backgroundColor: "#82c7d1",
          },
        ],
      });

      // Preparar datos para la gráfica de pastel
      setPieData({
        labels: ["Completados", "Pendientes"],
        datasets: [
          {
            data: [habits_completed, habits_incopmleted],
            backgroundColor: ["#028391", "#82c7d1"],
          },
        ],
      });
    } catch (error) {
      console.error("Error al obtener datos por categoría:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el progreso por hábito
  const fetchProgressByHabit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/habits/progress/${selectedHabit}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response.data;

      // Verificar si el arreglo de progreso está presente
      if (!data || !data.progress_array) {
        console.error("No hay datos de progreso disponibles para este hábito.");
        setIsLoading(false);
        return;
      }

      const progressArray = data.progress_array;
      console.log(progressArray);

      // Preparar datos para la gráfica de barras
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

      // Calcular la completitud total del hábito seleccionado
      const totalProgress = progressArray.reduce(
        (sum, value) => sum + value,
        0
      );
      const averageCompletion = totalProgress / progressArray.length;

      setPieData({
        labels: ["Progreso Promedio", "Pendiente"],
        datasets: [
          {
            data: [averageCompletion, 100 - averageCompletion],
            backgroundColor: ["#028391", "#82c7d1"],
          },
        ],
      });
    } catch (error) {
      console.error("Error al obtener datos por hábito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="progress-graphs-container">
      <h2>Gráficos y Estadísticas</h2>
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="graphs">
          <div className="bar-graph">
            <h3>Progreso por Hábito</h3>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom", // Move legend to the bottom
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100, // Fijar el valor máximo del eje Y en 100
                    ticks: {
                      callback: (value) => `${value}%`, // Mostrar el valor como porcentaje
                    },
                  },
                },
              }}
            />
          </div>
          <div className="pie-graph">
            <h3>Progreso General</h3>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom", // Move legend to the bottom
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressGraphs;
