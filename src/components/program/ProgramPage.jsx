import React from "react";
import { useHistory, useLocation } from "react-router-dom";

// Components
import FormManager from "../forms/FormManager";
import Agenda from "./Agenda";

// antd setup
import { Col, Row, Card, Button } from "antd";

function ProgramPage() {
  const history = useHistory();
  const location = useLocation();

  const { initialView, initialFormMode, initialFormValues } = location.state;

  return (
    <Row gutter={28} justify="space-between">
      <Col span={12}>
        <Card title="Program Data" extra={<Button onClick={() => history.push("/review")}>Review Program</Button>}>
          <FormManager
            initialView={initialView}
            initialFormMode={initialFormMode}
            initialFormValues={initialFormValues}
          />
        </Card>
      </Col>
      <Col className="agendaView" span={12}>
        <Agenda initialView={initialView} />
      </Col>
    </Row>
  );
}

export default ProgramPage;
