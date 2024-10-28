import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos el archivo CSS
import "./HabitDetailsModal.css"; 

const CreateHabitButton = ({ onHabitCreated }) => {
  // Estado para mostrar el modal
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

  // Función para mostrar el modal para crear hábitos
  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  // Función para cerrar el modal de crear un hábito
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

    if (!token) return;

    // Validación de campos requeridos
    if (
      !newHabit.habit ||
      !newHabit.description ||
      !newHabit.category ||
      !newHabit.frequency
    ) {
      swalMessages.errorMessage("Por favor, completa todos los campos requeridos");
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

      // Verificamos que la respuesta sea exitosa y contenga datos
      if ((response.status === 201 || response.status === 200) && response.data) {
        // Aseguramos que el hábito tenga todos los campos necesarios
        const createdHabit = {
          ...response.data,
          achieved: 0, // Aseguramos que tenga un valor inicial
          id: response.data.id, // Aseguramos que tenga un ID
        };

        // Notificamos al componente principal
        onHabitCreated(createdHabit);
        
        // Mostramos mensaje de éxito
        swalMessages.successMessage("Hábito creado exitosamente");
        
        // Cerramos el modal
        closeCreateModal();
      } else {
        swalMessages.errorMessage("Hubo un problema al crear el hábito");
      }
    } catch (err) {
      console.error("Error en createHabit: ", err);
      swalMessages.errorMessage(
        err.response?.data?.message || "Error al crear el hábito. Por favor, verifica los datos."
      );
    }
  };

  return (
    
    <>
      {/* Botón para crear hábitos */}
      <Button className="btn-primary create-habits" onClick={openCreateModal}>
        Crear hábito
      </Button>

      {/* Modal para crear un nuevo hábito */}
      <Modal show={showCreateModal} onHide={closeCreateModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Nuevo Hábito</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {/* Notificaciones */}
            <Form.Group controlId="formNotifications" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Notificaciones"
                name="is_required_reminder"
                checked={newHabit.is_required_reminder}
                onChange={handleInputChange}
              />
            </Form.Group>
            <br />

            {/* Nombre del hábito */}
            <Form.Group controlId="formHabitName" className="mb-3">
              <Form.Label>Nombre <span className="span-red">*</span></Form.Label>

              <Form.Control
                type="text"
                name="habit"
                value={newHabit.habit}
                onChange={handleInputChange}
                placeholder="Nombre del hábito..."
                required
              />
            </Form.Group>

            {/* Descripción del hábito */}
            <Form.Group controlId="formHabitDescription" className="mb-3">
              <Form.Label>Descripción <span className="span-red">*</span></Form.Label>

              <Form.Control
                type="text"
                name="description"
                value={newHabit.description}
                onChange={handleInputChange}
                placeholder="Descripción del hábito..."
                required
              />
            </Form.Group>

            {/* Repeticiones del hábito */}
            <Form.Group controlId="formHabitGoal" className="mb-3">
              <Form.Label>Número de repeticiones <span className="span-red">*</span></Form.Label>

              <Form.Control
                type="number"
                name="goal"
                value={newHabit.goal}
                onChange={handleInputChange}
                placeholder="Repeticiones del hábito..."
                min="1"
                required
              />
            </Form.Group>

            {/* Frecuencia del hábito */}
            <Form.Group controlId="formHabitFrequency" className="mb-3">
              <Form.Label>Frecuencia <span className="span-red">*</span></Form.Label>

              <Form.Select
                name="frequency"
                value={newHabit.frequency}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled className="form-select">Selecciona una frecuencia...</option>
                <option value="d" className="form-select-option">diaria</option>
                <option value="w" className="form-select-option">semanal</option>
                <option value="m" className="form-select-option">mensual</option>
              </Form.Select>
            </Form.Group>

            {/* Categoría del hábito */}
            <Form.Group controlId="formHabitCategory" className="mb-3">
              <Form.Label>Categoría <span className="span-red">*</span></Form.Label>

              <Form.Select
                name="category"
                value={newHabit.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled className="form-select">Selecciona una categoría...</option>
                <option value="school" className="form-select-option">Escuela</option>
                <option value="work" className="form-select-option">Trabajo</option>
                <option value="sports" className="form-select-option">Deporte</option>
                <option value="cleaning" className="form-select-option">Limpieza</option>
                <option value="leisure" className="form-select-option">Ocio</option>
                <option value="other" className="form-select-option">Otro</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        {/* Botón para enviar los datos ingresados */}
        <Modal.Footer className="border-0">
          <Button className="btn-primary" variant="success" onClick={createHabit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateHabitButton;