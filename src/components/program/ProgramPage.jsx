import React from "react";
import { useLocation } from "react-router-dom";

// Components
import FormManager from "../forms/FormManager";
import Agenda from "./Agenda";

// antd setup
import { Popover, Button, Col, Row, Card } from "antd";
import { InfoCircleTwoTone } from "@ant-design/icons";

function ProgramPage() {
  const location = useLocation();

  const { initialView, initialFormMode, initialFormValues } = location.state;

  const infoBlock = () => {
    const text = (
      <>
        <p>Info goes here.</p>
        <p>It could be something long and rambling</p>
        <ul>
          <li>the weather</li>
          <li>the Chefs won the Super Bowl</li>
          <li>Go Chefs</li>
        </ul>
        <p>Or just a short 2 line reminder.</p>
      </>
    );
    return (
      <Popover content={text} title="Note" trigger="click">
        <Button type="text">
          <InfoCircleTwoTone />
        </Button>
      </Popover>
    );
  };

  return (
    <Row gutter={28} justify="space-between">
      <Col span={12}>
        <Card title="Program Data" extra={infoBlock()}>
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
