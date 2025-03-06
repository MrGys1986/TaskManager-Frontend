import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../services/axiosConfig"; // ✅ Importar configuración de Axios

const { Option } = Select;

const GroupForm = ({ onGroupCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  // ✅ Función para mostrar el modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // ✅ Función para cerrar el modal y resetear el formulario
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // ✅ Buscar usuarios por correo mientras se escribe (con debounce para evitar peticiones innecesarias)
  let searchTimeout;
  const fetchUsers = async (searchText) => {
    if (!searchText) return; // No buscar si el input está vacío

    setIsFetchingUsers(true);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      try {
        const response = await api.get(`/api/groups/get-users`, { params: { query: searchText } }); // 🔹 Ruta corregida con `/api`
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          message.error("No se pudieron cargar los usuarios.");
        }
      } catch (error) {
        message.error("Error al obtener los usuarios.");
      }
      setIsFetchingUsers(false);
    }, 500); // ⏳ Retraso de 500ms para optimizar la búsqueda
  };

  // ✅ Función para manejar la creación del grupo
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Asegurar que el usuario actual esté en la lista de miembros
      const selectedMembers = values.members || [];
      const memberIds = [...new Set([currentUserId, ...selectedMembers])]; // Evita duplicados

      const response = await api.post(`/api/groups/create-group`, {
        name: values.name,
        createdBy: currentUserId,
        members: memberIds,
      });

      if (response.data.success) {
        message.success("✅ Grupo creado exitosamente.");
        onGroupCreated(); // 🔄 Actualizar lista de grupos
        handleCancel(); // Cerrar modal
      } else {
        message.error(`❌ Error al crear el grupo: ${response.data.message}`);
      }
    } catch (error) {
      message.error("❌ Completa todos los campos correctamente.");
    }
  };

  return (
    <>
      {/* Botón flotante para crear grupo */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        style={{ position: "fixed", bottom: 30, right: 30, zIndex: 1000 }}
        onClick={showModal}
      />

      {/* Modal para crear nuevo grupo */}
      <Modal
        title="Crear Nuevo Grupo"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          {/* Nombre del grupo */}
          <Form.Item
            label="Nombre del Grupo"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa el nombre del grupo." }]}
          >
            <Input placeholder="Ejemplo: Equipo de Desarrollo" />
          </Form.Item>

          {/* Seleccionar miembros */}
          <Form.Item
            label="Miembros"
            name="members"
            rules={[{ required: true, message: "Selecciona al menos un miembro." }]}
          >
            <Select
              mode="multiple"
              placeholder="Escribe para buscar usuarios"
              onSearch={fetchUsers}
              filterOption={false}
              notFoundContent={isFetchingUsers ? <Spin size="small" /> : "No se encontraron usuarios"}
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GroupForm;
