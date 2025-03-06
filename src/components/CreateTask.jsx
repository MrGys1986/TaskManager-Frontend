import React, { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../services/axiosConfig";


const { TextArea } = Input;
const { Option } = Select;

const CreateTask = ({ userId, onTaskCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
  
      if (!userId) {
        message.error("No se pudo identificar al usuario. Intenta iniciar sesión nuevamente.");
        return;
      }
  
      setLoading(true);
  
      const response = await api.post("/api/tasks", {
        ...values,
        userId,
        DeadLine: values.DeadLine ? values.DeadLine.toDate() : null,
      });
  
      if (response.data.success) {
        message.success("✅ ¡Tarea creada exitosamente! 🚀");
        onTaskCreated();
        handleCancel();
      } else {
        message.error(`❌ Error al crear la tarea: ${response.data.message}`);
      }
    } catch (error) {
      message.error("❌ Por favor completa todos los campos correctamente.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
      {/* Botón flotante */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        style={{ position: "fixed", bottom: 30, right: 30, zIndex: 1000 }}
        onClick={showModal}
      />

      {/* Modal para crear tarea */}
      <Modal
        title="Crear Nueva Tarea"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre de la Tarea"
            name="NameTask"
            rules={[{ required: true, message: "Por favor ingresa el nombre de la tarea" }]}
          >
            <Input placeholder="Ejemplo: Actualizar documentación" />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="Description"
            rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
          >
            <TextArea rows={4} placeholder="Describe los detalles de la tarea" />
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
    </>
  );
};

export default CreateTask;
