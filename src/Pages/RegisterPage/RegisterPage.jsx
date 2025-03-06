import React, { useState } from "react";
import { Card, Button, Input, Form, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosConfig"; // ✅ Importamos la configuración de Axios

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Manejo de envío del formulario
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/register", values); // 🔹 Ruta corregida

      if (response.data.success) {
        message.success("🎉 Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/login");
      } else {
        message.error(`❌ ${response.data.message}`);
      }
    } catch (error) {
      message.error("❌ Error de conexión con el servidor.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3} style={styles.title}>Crear una Cuenta</Title>
        <Form layout="vertical" onFinish={onFinish}>
          {/* ✅ Correo Electrónico */}
          <Form.Item 
            label="Correo Electrónico" 
            name="email" 
            rules={[
              { required: true, message: "Ingrese su correo electrónico" },
              { type: "email", message: "Ingrese un correo válido" }
            ]}
          >
            <Input type="email" />
          </Form.Item>

          {/* ✅ Nombre de Usuario */}
          <Form.Item 
            label="Nombre de Usuario" 
            name="username" 
            rules={[{ required: true, message: "Ingrese un nombre de usuario" }]}
          >
            <Input />
          </Form.Item>

          {/* ✅ Contraseña */}
          <Form.Item 
            label="Contraseña" 
            name="password" 
            rules={[
              { required: true, message: "Ingrese una contraseña" },
              { min: 6, message: "La contraseña debe tener al menos 6 caracteres" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Registrarse
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: "center", marginTop: 10 }}>
          ¿Ya tienes una cuenta?{" "}
          <Button type="link" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </p>
      </Card>
    </div>
  );
};

// 🎨 Estilos
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #004d7a, #008793)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 400,
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: { marginBottom: 20 },
};

export default RegisterPage;
