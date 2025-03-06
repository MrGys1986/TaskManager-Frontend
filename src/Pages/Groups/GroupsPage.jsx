import React, { useEffect, useState } from 'react';
import { List, Button, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from "../../Layouts/MainLayouts";
import GroupForm from "../../components/GroupForm";
import api from "../../services/axiosConfig";

const { Title } = Typography;

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const fetchGroups = async () => {
    try {
      const response = await api.get(`/api/groups`, {
        params: { userId }, // ✅ Ahora pasamos el userId correctamente
      });
  
      if (response.data.success) {
        setGroups(response.data.groups);
      } else {
        message.error('Error al cargar grupos');
      }
    } catch (error) {
      message.error('Error al obtener grupos');
    }
  };
  

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <MainLayout>
      <div style={{ padding: 20 }}>
        <Title level={3}>📋 Mis Grupos</Title>
        <List
          dataSource={groups}
          renderItem={group => (
            <List.Item
              actions={[
<Button onClick={() => navigate(`/group/${group.id}`)}>
  Ver Tareas
</Button>

              ]}
            >
              {group.name}
            </List.Item>
          )}
        />
        {/* Integrando el formulario para crear grupos */}
        <GroupForm onGroupCreated={fetchGroups} />
      </div>
    </MainLayout>
  );
};

export default GroupsPage;