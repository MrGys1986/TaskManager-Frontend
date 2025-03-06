import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../services/axiosConfig";
import MainLayout from "../../Layouts/MainLayouts";

const { Option } = Select;

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // 🔹 Búsqueda optimizada
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userRole = localStorage.getItem("userRole");

  // ✅ Obtener usuarios con búsqueda optimizada (debounce)
  const fetchUsers = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users/get-users-admin`, {
        params: { searchTerm },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        message.error(response.data.message || "Error al cargar usuarios.");
      }
    } catch (error) {
      message.error("❌ Error de conexión con el servidor.");
    }
    setLoading(false);
  };

  // 📌 Cargar usuarios al inicio y al buscar (con debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(searchValue);
    }, 500); // ⏳ Espera 500ms antes de llamar a la API

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  // ✅ Buscar usuarios en tiempo real
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  // ✅ Abrir modal para editar usuario
  const showEditModal = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.rol,
    });
  };

  // ✅ Guardar cambios de usuario
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();

      await api.put(`/api/users/update-user-admin/${editingUser.id}`, values);

      message.success("✅ Usuario actualizado correctamente.");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("❌ Error al actualizar usuario.");
    }
  };

  // ✅ Eliminar usuario con confirmación
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/users/delete-user-admin/${userId}`);

      message.success("✅ Usuario eliminado correctamente.");
      fetchUsers();
    } catch (error) {
      message.error("❌ Error al eliminar usuario.");
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: "20px" }}>
        <h2>🔧 Gestión de Usuarios</h2>

        {/* Búsqueda en tiempo real */}
        <Input.Search
          placeholder="Buscar usuario por nombre o correo..."
          allowClear
          enterButton
          onChange={handleSearch}
          style={{ marginBottom: 16, width: 300 }}
        />

        {/* Tabla de usuarios */}
        <Table
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        >
          <Table.Column title="Nombre" dataIndex="username" key="username" />
          <Table.Column title="Correo" dataIndex="email" key="email" />
          <Table.Column title="Rol" dataIndex="rol" key="rol" />

          <Table.Column
            title="Acciones"
            key="actions"
            render={(text, record) => (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                  style={{ marginRight: 8 }}
                  disabled={record.rol === "admin"} // 🔹 Evita editar admin
                >
                  Editar
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDeleteUser(record.id)}
                  disabled={record.rol === "admin"} // 🔹 Evita eliminar admin
                >
                  Eliminar
                </Button>
              </>
            )}
          />
        </Table>

        {/* Modal para editar usuario */}
        <Modal
          title="Editar Usuario"
          open={isModalVisible}
          onOk={handleSaveUser}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nombre"
              name="username"
              rules={[{ required: true, message: "Ingrese el nombre del usuario" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Correo"
              name="email"
              rules={[{ required: true, message: "Ingrese el correo del usuario" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Rol"
              name="role"
              rules={[{ required: true, message: "Seleccione el rol" }]}
            >
              <Select>
                <Option value="usuario">Usuario</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminUsersPage;
