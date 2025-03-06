import React, { useEffect, useState } from "react";
import { Card, Button, Input, Form, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosConfig"; // ✅ Importar configuración de Axios

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔹 Si el usuario ya tiene sesión activa, lo enviamos al Dashboard
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }

    // 🔹 Evitar que pueda regresar con "atrás" después de cerrar sesión
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };

  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", values);

      if (response.data.success) {
        message.success("Inicio de sesión exitoso");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);
        console.log("📌 Usuario guardado en localStorage:", localStorage);
        navigate("/dashboard");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error de conexión con el servidor.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3} style={styles.title}>Iniciar Sesión</Title>
        <Form layout="vertical" onFinish={onFinish}>
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

          <Form.Item 
            label="Contraseña" 
            name="password" 
            rules={[{ required: true, message: "Ingrese su contraseña" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: "center", marginTop: 10 }}>
          ¿No tienes una cuenta?{" "}
          <Button type="link" onClick={() => navigate("/register")}>
            Regístrate aquí
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



export default LoginPage;
