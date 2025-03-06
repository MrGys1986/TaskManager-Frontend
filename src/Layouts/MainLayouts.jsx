import React, { useState, useEffect } from "react";
import { Layout, Menu, Spin } from "antd";
import { UserOutlined, TeamOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "Usuario";
  const userRole = localStorage.getItem("role");

  const [loading, setLoading] = useState(true); // 📌 Estado de carga global

  // Simular carga cuando cambia la página
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // ⏳ Simula carga durante 2 segundo (ajustable)
    
    return () => clearTimeout(timer);
  }, [location.pathname]); // 📌 Se ejecuta cada vez que cambia la ruta

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Barra de navegación superior */}
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", color: "#fff" }}>
        <h2 style={{ color: "white", margin: 0 }}>Task Manager</h2>
        <div>
          <span style={{ marginRight: 20 }}>Bienvenido, {username}</span>
          <LogoutOutlined onClick={handleLogout} style={{ cursor: "pointer", fontSize: 18 }} />
        </div>
      </Header>

      <Layout>
        {/* Menú lateral */}
        <Sider width={250} style={{ background: "#fff" }}>
          <Menu mode="inline" selectedKeys={[location.pathname]}>
            <Menu.Item key="/dashboard" icon={<UserOutlined />} onClick={() => navigate("/dashboard")}>
              Mis Tareas
            </Menu.Item>
            <Menu.Item key="/groups" icon={<TeamOutlined />} onClick={() => navigate("/groups")}>
              Grupos
            </Menu.Item>
            {userRole === "admin" && (
              <Menu.Item key="/admin-users" icon={<SettingOutlined />} onClick={() => navigate("/admin-users")}>
                Gestión de Usuarios
              </Menu.Item>
            )}
          </Menu>
        </Sider>

        {/* Contenido Principal con carga */}
        <Layout style={{ padding: "20px" }}>
          <Content>
            {loading ? (
              <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
                <p>Cargando datos...</p>
              </div>
            ) : (
              children
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
