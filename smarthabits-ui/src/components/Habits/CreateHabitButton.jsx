import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "./HabitDetailsModal.css"; // Importa el archivo CSS para el modal

const CreateHabitButton = ({ onHabitCreated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Estados para el nuevo hábito
  const [newHabit, setNewHabit] = useState({
    habit: "",
    description: "",
    category: "",
    frequency: "",
    goal: "1",
    is_required_reminder: false,
  });

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setNewHabit({
      habit: "",
      description: "",
      category: "",
      frequency: "",
      goal: "1",
      is_required_reminder: false,
    });
    setShowCreateModal(false);
  };

  // Función para manejar el formulario de creación de hábito
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewHabit({
      ...newHabit,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función para enviar el nuevo hábito al backend
  const createHabit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No token found, please log in.");
      return;
    }

    // Validación de campos requeridos
    if (
      !newHabit.habit ||
      !newHabit.description ||
      !newHabit.category ||
      !newHabit.frequency
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/habits/create/",
        newHabit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const createdHabit = response.data;

      // Comprobar si la respuesta contiene todos los campos necesarios
      if (!createdHabit.habit || !createdHabit.description) {
        alert(
          "La respuesta del backend no contiene toda la información necesaria."
        );
        return;
      }

      onHabitCreated(createdHabit); // Notificar al componente principal del nuevo hábito
      closeCreateModal(); // Cerrar el modal después de crear el hábito
    } catch (err) {
      alert("Failed to create habit. Please try again.");
      console.error("Error in createHabit:", err);
    }
  };

  return (
    <>
      <Button className="create-button" onClick={openCreateModal}>
        Crear hábito
      </Button>

      {/* Modal para Crear un Nuevo Hábito */}
      <Modal show={showCreateModal} onHide={closeCreateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Hábito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formHabitName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="habit"
                value={newHabit.habit}
                onChange={handleInputChange}
                placeholder="Nombre del hábito..."
                required
              />
            </Form.Group>

            <Form.Group controlId="formHabitDescription" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newHabit.description}
                onChange={handleInputChange}
                placeholder="Descripción del hábito..."
                required
              />
            </Form.Group>

            <Form.Group controlId="formHabitCategory" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="category"
                value={newHabit.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una categoría...</option>
                <option value="school">Escuela</option>
                <option value="work">Trabajo</option>
                <option value="sports">Deporte</option>
                <option value="cleaning">Limpieza</option>
                <option value="leisure">Ocio</option>
                <option value="other">Otro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formHabitFrequency" className="mb-3">
              <Form.Label>Frecuencia</Form.Label>
              <Form.Select
                name="frequency"
                value={newHabit.frequency}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una frecuencia...</option>
                <option value="d">Diaria</option>
                <option value="w">Semanal</option>
                <option value="m">Mensual</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formHabitGoal" className="mb-3">
              <Form.Label>Número de repeticiones</Form.Label>
              <Form.Control
                type="number"
                name="goal"
                value={newHabit.goal}
                onChange={handleInputChange}
                min="1"
                placeholder="Repeticiones del hábito..."
                required
              />
            </Form.Group>

            <Form.Group controlId="formNotifications" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Notificaciones"
                name="is_required_reminder"
                checked={newHabit.is_required_reminder}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={createHabit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateHabitButton;
