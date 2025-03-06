import React from 'react';
import { Button, Typography, Card, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  ThunderboltOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  // Función para ir a Login
  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #004d7a, #008793, #00bf72, #a8eb12)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: 700,
          backgroundColor: '#ffffffcc',
          padding: '40px',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          marginBottom: 40,
        }}
      >
        <Title style={{ margin: 0, color: '#333', fontSize: '3rem' }}>Task Manager</Title>
        <Paragraph style={{ fontSize: '1.1rem', color: '#444', marginTop: 10 }}>
          El mejor administrador de tareas para equipos y profesionales que buscan
          maximizar su productividad.
        </Paragraph>
      </div>

      {/* Features Section */}
      <Row
        gutter={[16, 16]}
        style={{
          maxWidth: 1000,
          width: '100%',
          marginBottom: 40,
          padding: '0 20px',
        }}
      >
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{ borderRadius: 8, textAlign: 'center', minHeight: 220 }}
          >
            <CheckCircleOutlined style={{ fontSize: '2rem', color: '#00bf72' }} />
            <Title level={4} style={{ marginTop: 16 }}>Organiza tus tareas</Title>
            <Paragraph>
              Crea, clasifica y prioriza tus pendientes de forma sencilla e intuitiva.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{ borderRadius: 8, textAlign: 'center', minHeight: 220 }}
          >
            <ThunderboltOutlined style={{ fontSize: '2rem', color: '#008793' }} />
            <Title level={4} style={{ marginTop: 16 }}>Acelera tu flujo de trabajo</Title>
            <Paragraph>
              Optimiza tus procesos y ahorra tiempo con nuestras herramientas de seguimiento.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{ borderRadius: 8, textAlign: 'center', minHeight: 220 }}
          >
            <TeamOutlined style={{ fontSize: '2rem', color: '#004d7a' }} />
            <Title level={4} style={{ marginTop: 16 }}>Colabora en equipo</Title>
            <Paragraph>
              Comparte tareas, delega actividades y mantén la comunicación fluida con tu equipo.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Call to Action Buttons */}
      <Space size="large">
        <Button
          type="primary"
          size="large"
          onClick={goToLogin}
          style={{ minWidth: 140 }}
        >
          Iniciar Sesión
        </Button>
        <Button
          size="large"
          style={{ minWidth: 140 }}
          onClick={goToRegister}
          // De momento no hay funcionalidad
        >
          Registrarse
        </Button>
      </Space>
    </div>
  );
};

export default LandingPage;
