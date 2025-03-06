import React, { useEffect, useState } from "react";
import MainLayout from "../../Layouts/MainLayouts";
import { Typography, List, Button, message, Select, Popconfirm, Modal, Form, Input, DatePicker, Card } from "antd";
import { LogoutOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreateTask from "../../components/CreateTask";
import dayjs from "dayjs";
import api from "../../services/axiosConfig"; // Importamos axiosConfig.js


const { Title } = Typography;
const { Option } = Select;

const DashboardPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuario";
  const userId = localStorage.getItem("userId");
  const [tasks, setTasks] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [form] = Form.useForm();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // ✅ Obtener las tareas del usuario desde el backend
  const fetchTasks = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
        params: { userId },
      });
  
      if (response.data.success) {
        setTasks(response.data.tasks);
      } else {
        message.error("No se pudieron cargar las tareas");
      }
    } catch (error) {
      message.error("Error al obtener las tareas");
    }
    
  };
  

  // ✅ Cargar las tareas al cargar el Dashboard
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // ✅ Función para actualizar el estado de la tarea
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/api/tasks/update-task-status/${taskId}`, {
        Status: newStatus,
      });
  
      if (response.data.success) {
        message.success("Estado de la tarea actualizado");
        fetchTasks();
      } else {
        message.error(`Error al actualizar la tarea: ${response.data.message}`);
      }
    } catch (error) {
      message.error("Error al actualizar la tarea");
    }
  };
  
  

  // ✅ Función para eliminar la tarea
  const deleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/api/tasks/delete-task/${taskId}`);
  
      if (response.data.success) {
        message.success("Tarea eliminada exitosamente");
        fetchTasks();
      } else {
        message.error(`Error al eliminar la tarea: ${response.data.message}`);
      }
    } catch (error) {
      message.error("Error al eliminar la tarea");
    }
  };
  
  

  // ✅ Abrir modal para editar la tarea
  const openEditModal = (task) => {
    setCurrentTask(task);
    form.setFieldsValue({
      NameTask: task.NameTask || "",
      Description: task.Description || "",
      Category: task.Category || undefined,
      DeadLine: task.DeadLine ? dayjs(task.DeadLine) : null,
      Status: task.Status || undefined,
    });
    setIsEditModalVisible(true);
  };

  // ✅ Guardar cambios de la tarea editada
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
  
      // Convertir la fecha correctamente
      const formattedDeadline = values.DeadLine ? values.DeadLine.toISOString() : null;
  
      const updatedTask = {
        NameTask: values.NameTask,
        Description: values.Description,
        Category: values.Category,
        DeadLine: formattedDeadline,
        Status: values.Status,
      };
  
      console.log("📌 Datos enviados a la API:", updatedTask); // Debug
  
      // Enviar solicitud para actualizar la tarea
      const response = await api.patch(`/api/tasks/update-task/${currentTask.id}`, updatedTask);
  
      if (response.data.success) {
        message.success("Tarea actualizada correctamente");
        setIsEditModalVisible(false);
        fetchTasks(); // Recargar la lista de tareas
      } else {
        message.error(`Error al actualizar la tarea: ${response.data.message}`);
      }
    } catch (error) {
      message.error("Error al guardar los cambios");
      console.error("🔥 Error en handleEditSubmit:", error);
    }
  };
  
  

  return (
    <MainLayout>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Encabezado con usuario y logout */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Title level={3}>Bienvenido, {username} 👋</Title>
          
        </div>

        {/* ✅ Mostrar lista de tareas */}
        <Title level={4}>Tus Tareas 📋</Title>
        <List
          itemLayout="vertical"
          dataSource={tasks}
          locale={{ emptyText: "No hay tareas disponibles" }}
          renderItem={(task) => (
            <Card
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
              title={task.NameTask}
              extra={
                <Select
                  defaultValue={task.Status}
                  style={{ width: 150 }}
                  onChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                >
                  <Option value="Pendiente">Pendiente</Option>
                  <Option value="En progreso">En progreso</Option>
                  <Option value="Completada">Completada</Option>
                </Select>
              }
              actions={[
                <Button icon={<EditOutlined />} onClick={() => openEditModal(task)}>
                  Editar
                </Button>,
                <Popconfirm
                  title="¿Seguro que deseas eliminar esta tarea?"
                  onConfirm={() => deleteTask(task.id)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Eliminar
                  </Button>
                </Popconfirm>,
              ]}
            >
              <p><strong>Descripción:</strong> {task.Description}</p>
              <p><strong>Categoría:</strong> {task.Category}</p>
              <p><strong>Fecha Límite:</strong> {task.DeadLine ? dayjs(task.DeadLine).format("DD [de] MMMM [de] YYYY, h:mm A") : "Sin fecha"}</p>

            </Card>
          )}
        />

        {/* Botón para crear tarea */}
        <CreateTask userId={userId} onTaskCreated={fetchTasks} />

        {/* Modal para editar tarea */}
        <Modal
          title="Editar Tarea"
          visible={isEditModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setIsEditModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nombre de la Tarea"
              name="NameTask"
              rules={[{ required: true, message: "Por favor ingresa el nombre de la tarea" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Descripción"
              name="Description"
              rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Categoría"
              name="Category"
              rules={[{ required: true, message: "Selecciona una categoría" }]}
            >
              <Select placeholder="Selecciona una categoría">
                <Option value="Trabajo">Trabajo</Option>
                <Option value="Personal">Personal</Option>
                <Option value="Urgente">Urgente</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Fecha Límite"
              name="DeadLine"
              rules={[{ required: true, message: "Selecciona una fecha límite" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Estado"
              name="Status"
              rules={[{ required: true, message: "Selecciona el estado de la tarea" }]}
            >
              <Select placeholder="Selecciona el estado">
                <Option value="Pendiente">Pendiente</Option>
                <Option value="En progreso">En progreso</Option>
                <Option value="Completada">Completada</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
