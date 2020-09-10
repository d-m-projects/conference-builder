import React, { useContext } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import moment from "moment";

import { Table, Space, Tooltip } from "antd";
import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";

import { VIEW } from "../forms/FormManager";
import Presentations from "./Presentations";
import EditDeleteWidget from "./EditDeleteWidget";

import { formatDataSource } from "./formatDataSource";

const { Column } = Table;

function Sessions({ doReorder, sessions }) {
  // 2nd level. descendent of `days`.
  // concerned with `sessions` and passing down `presentations` nested data.
  const program = useContext(ProgramContext);
  const { getSessionById } = program;

  const history = useHistory();

  // '+' Widget handle func
  const handleAddPresentation = (sessionId) => {
    const session = getSessionById(sessionId);

    history.push("/program", {
      initialView: VIEW.PRESENTATION,
      initialFormMode: "add",
      initialFormValues: { presentationLength: [session.dateStart, session.dateEnd] },
      sessionId,
    });
  };

  const sessiondata = (s) => {
    s.sessionsDateString = `${s.name} (${moment(s.dateStart).format("HH:mm")}-${moment(s.dateEnd).format("HH:mm")})`;
    return s;
  };

  return (
    <Table
      className="program-session"
      showHeader={false}
      size="small"
      style={{ marginLeft: "20px" }}
      dataSource={formatDataSource(sessions)}
      pagination={false}>
      <Column
        title="Session Name"
        dataIndex="dateStart"
        render={(_, session) => {
          return (
            <div>
              <Space size={8}>
                <p>Session: {sessiondata(session).sessionsDateString}</p>
                <Tooltip title="Add Presentation">
                  <PlusOutlined onClick={() => handleAddPresentation(session.id)} />
                </Tooltip>
                <Tooltip title="Reorder Presentations">
                  <UnorderedListOutlined onClick={() => doReorder(session.presentations, session)} />
                </Tooltip>

                <EditDeleteWidget event={session} type="session" />
              </Space>
              <Presentations {...session} />
              <p>&nbsp;</p>
            </div>
          );
        }}
      />
    </Table>
  );
}

export default Sessions;
