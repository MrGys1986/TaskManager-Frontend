import React from "react";
import { Card, Col, Row, Typography, Select, message } from "antd";
import "./KanbanBoard.css";

const { Title } = Typography;
const { Option } = Select;

const KanbanBoard = ({ tasks, members, currentUserId, groupCreatorId, onStatusChange }) => {
  const statuses = ["To Do", "In Progress", "Done"];

  // Verificar permisos para editar el estatus
  const canEditStatus = (task) => {
    return currentUserId === groupCreatorId || currentUserId === task.assignedTo;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Kanban Board</Title>
      <Row gutter={16}>
        {statuses.map((status) => (
          <Col span={8} key={status}>
            <div className="kanban-column">
              <Title level={4}>{status}</Title>
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Card key={task.id} className="kanban-card" title={task.name}>
                    <p>{task.description}</p>
                    <p><strong>Asignado a:</strong> {members.find(m => m.id === task.assignedTo)?.username || "Sin asignar"}</p>

                    {/* Selector de estatus si el usuario tiene permisos */}
                    {canEditStatus(task) ? (
                      <Select
                        defaultValue={task.status}
                        onChange={(value) => onStatusChange(task.id, value, task)}
                        style={{ width: "100%", marginTop: 10 }}
                      >
                        {statuses.map((s) => (
                          <Option key={s} value={s}>{s}</Option>
                        ))}
                      </Select>
                    ) : (
                      <p><em>No tienes permisos para cambiar el estatus</em></p>
                    )}
                  </Card>
                ))}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KanbanBoard;
