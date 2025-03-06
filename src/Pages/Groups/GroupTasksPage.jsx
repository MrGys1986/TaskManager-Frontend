import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Input, Select, message, Typography } from "antd";
import MainLayout from "../../Layouts/MainLayouts";
import KanbanBoard from "../../components/KanbanBoard";
import api from "../../services/axiosConfig";

const { Title } = Typography;
const { Option } = Select;

const GroupTasksPage = () => {
  const { groupId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const [members, setMembers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", description: "", assignedTo: "" });
  const currentUserId = localStorage.getItem("userId");

  // Obtener detalles del grupo y miembros
  const fetchGroupDetails = async () => {
    try {
      const response = await api.get(`/api/groups/get-group-details/${groupId}`); // 🔹 Aseguramos la ruta
  
      if (response.data.success) {
        setGroupDetails(response.data.group);
        setMembers(response.data.members);
      } else {
        message.error("Error al obtener detalles del grupo");
      }
    } catch (err) {
      message.error("Error al cargar detalles del grupo");
    }
  };
  

  // Obtener tareas del grupo
  const fetchTasks = async () => {
    try {
      const response = await api.get(`/api/groups/get-group-tasks`, { params: { groupId } }); // 🔹 Ajuste en la ruta y formato
  
      if (response.data.success) {
        setTasks(response.data.tasks);
      } else {
        message.error("Error al obtener tareas");
      }
    } catch (err) {
      message.error("Error al cargar tareas");
    }
  };

  // 🚀 Actualizar tareas cada 3 segundos
  useEffect(() => {
    fetchGroupDetails();
    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks();
    }, 3000);

    return () => clearInterval(interval); // 🔹 Limpiar intervalo al desmontar el componente
  }, [groupId]);

  // Crear nueva tarea (solo creador del grupo)
  const handleCreateTask = async () => {
    if (groupDetails.createdBy !== currentUserId) {
      message.error("Solo el creador del grupo puede crear tareas.");
      return;
    }
  
    // Verificar que todos los campos están llenos
    if (!newTask.name || !newTask.description || !newTask.assignedTo) {
      message.error("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      const response = await api.post(`/api/groups/create-group-task`, {
        ...newTask,
        groupId,
        createdBy: currentUserId,
      });
  
      if (response.data.success) {
        message.success("✅ Tarea creada exitosamente.");
        setIsModalVisible(false);
        setNewTask({ name: "", description: "", assignedTo: "" });
        fetchTasks(); // 🔄 Actualiza la lista de tareas
      } else {
        message.error(`❌ Error al crear la tarea: ${response.data.message}`);
      }
    } catch (error) {
      message.error("❌ Error en la conexión con el servidor.");
    }
  };
  

  // Cambiar el estatus de la tarea (control de permisos)
  const handleStatusChange = async (taskId, status, task) => {
    const isAuthorized = groupDetails.createdBy === currentUserId || task.assignedTo === currentUserId;
  
    if (!isAuthorized) {
      message.error("No tienes permiso para cambiar el estatus de esta tarea.");
      return;
    }
  
    try {
      const response = await api.put(`/api/groups/update-group-task-status/${taskId}`, {
        status,
        userId: currentUserId,
      });
  
      if (response.data.success) {
        message.success("Estatus actualizado");
        fetchTasks();
      } else {
        message.error(response.data.message || "Error al actualizar el estatus");
      }
    } catch (err) {
      message.error("Error al actualizar el estatus");
    }
  };
  

  return (
    <MainLayout>
      <div style={{ padding: 20 }}>
        <Title level={3}>📋 Tareas del Grupo - {groupDetails.name || ""}</Title>

        {/* Mostrar botón de crear tarea solo al creador */}
        {groupDetails.createdBy === currentUserId && (
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Crear Nueva Tarea
          </Button>
        )}

        {/* Kanban Board */}
        <KanbanBoard
          tasks={tasks}
          members={members}
          currentUserId={currentUserId}
          groupCreatorId={groupDetails.createdBy}
          onStatusChange={handleStatusChange}
        />

        {/* Modal para crear tarea */}
        <Modal
          title="Crear Nueva Tarea"
          visible={isModalVisible}
          onOk={handleCreateTask}
          onCancel={() => setIsModalVisible(false)}
        >
          <Input
            placeholder="Nombre de la Tarea"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <Input.TextArea
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={4}
          />
          <Select
            placeholder="Asignar a"
            value={newTask.assignedTo}
            onChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
            style={{ width: "100%", marginTop: 10 }}
          >
            {members.map((member) => (
              <Option key={member.id} value={member.id}>
                {member.username}
              </Option>
            ))}
          </Select>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default GroupTasksPage;
