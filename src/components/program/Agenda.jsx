import React, { useContext, useState } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import moment from "moment";

// antd components
import { Skeleton, Table, Card, Button, Space, Popconfirm, message, Tooltip, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";

// Components
import { VIEW } from "../forms/FormManager";
import ReorderDnD from "./AgendaForm/ReorderDnD";

// Edit Program Modal
import EditProgramModal from "./AgendaModal/EditProgramModal";

// Dev test data
// import injection from "../../data/testdata";

const { Column } = Table;

function CustomEvent({ event, type }) {
  const program = useContext(ProgramContext);
  const {
    selectedSessionId,
    getNextPresenterId,
    setNextPresenterId,
    selectSessionByPresentationId,
    deleteSession,
    deletePresentation,
  } = program;

  const history = useHistory();

  const handleDelete = (event, type) => {
    if (type === "session") {
      if (selectedSessionId === event.id) {
        message.error("Cannot delete a session with modifications in progress!");
      } else {
        deleteSession(event.id);
        message.success(`"${event.name}" deleted!`);
      }
    } else {
      // Presentation
      deletePresentation(event.id);
      message.success(`"${event.name}" deleted!`);
    }
  };

  const handleEdit = (event, type) => {
    // When the user clicks edit on something else and the form is the same,
    // just throw a notification that yes we are editing what you last clicked.
    message.info(`Now editing "${event.name}"`);

    if (type === "session") {
      const initialFormValues = {
        sessionId: event.id,
        sessionName: event.name,
        sessionLength: [event.dateStart, event.dateEnd],
      };

      history.push("/program", {
        initialView: VIEW.SESSION,
        initialFormMode: "edit",
        initialFormValues,
      });
    } else {
      selectSessionByPresentationId(event.id);

      const presenters = [];
      let pId = getNextPresenterId();

      event.presenters.forEach((presenter) => {
        presenters.push({ name: presenter, id: String(pId) });
        pId++;
      });

      // Manually update presenter id
      setNextPresenterId(pId + 1);

      const creditsList = [];
      for (const key in event.credits) {
        creditsList.push(`${key} | ${event.credits[key]}`);
      }

      const initialFormValues = {
        presentationName: event.name,
        presentationLength: [event.dateStart, event.dateEnd],
        presenters: presenters,
        credits: event.credits,
        creditsList: creditsList,
      };

      history.push("/program", {
        initialView: VIEW.PRESENTATION,
        initialFormMode: "edit",
        initialFormValues,
        presentationId: event.id,
      });
    }
  };

  return (
    <Space size={8}>
      <Tooltip title={type === "session" ? `Edit Session` : `Edit Presentation`}>
        <EditOutlined onClick={() => handleEdit(event, type)} />
      </Tooltip>
      <Popconfirm
        title={`Are you sure you want to delete this ${type === "session" ? "session" : "presentation"}?`}
        onConfirm={() => handleDelete(event, type)}
        okText="Yes"
        cancelText="No">
        <Tooltip title={type === "session" ? `Delete Session` : `Delete Presentation`}>
          <DeleteOutlined />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
}

const Agenda = () => {
  // Top level of the agenda
  // concerned with `days` and passing down `sessions` nested data.

  // State for dynamic item list
  const [itemList, setItemList] = useState([]);
  const [single, setSingle] = useState({});

  // Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Edit Program Modal
  const [modalVisible, setModalVisible] = useState(false);

  const history = useHistory();

  const program = useContext(ProgramContext);

  // DEV ONLY (by darrin)
  // if `program` is empty, fill it with example data for visualization.
  // Use when you need complete data in `program`
  // (so you don't have to enter it manually)
  // if (!program.dateStart) {
  // 	program.injectTestData()
  // }

  const handleAddSession = (day) => {
    history.push("/program", {
      initialView: VIEW.SESSION,
      initialFormMode: "add",
      initialFormValues: { sessionLength: [day, day] },
    });
  };

  const handleEditProgram = () => {
    setModalVisible(true);
  };

  const doReorder = (list, one) => {
    setSingle(one);
    setItemList(list);
    setDrawerVisible(true);
  };

  const programHeaderDateRange = (p) => {
    const programDateString = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`;

    return (
      <Button type="text" style={{ margin: 0, padding: 0 }}>
        {programDateString}
      </Button>
    );
  };

  const programHeader = (p) => {
    return (
      <Space size={8}>
        <span>{p.name}</span>
        <Tooltip title="Edit Program">
          <SettingOutlined onClick={handleEditProgram} />
        </Tooltip>
      </Space>
    );
  };

  return program.dateStart ? (
    <>
      <EditProgramModal visible={modalVisible} setVisible={setModalVisible} />
      <ReorderDnD
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        itemList={itemList}
        setItemList={setItemList}
        single={single}
      />

      <Card title={programHeader(program)} extra={programHeaderDateRange(program)}>
        <Table className="program-agenda" showHeader={false} size="small" dataSource={program.days} pagination={false}>
          <Column
            title="Date"
            dataIndex="date"
            render={(dataIndex, singleDay, i) => (
              <div key={i}>
                <Space size={8}>
                  <p>Program Day: {moment(dataIndex).format("ddd, MMM Do Y")}</p>
                  <Tooltip title="Add Session">
                    <PlusOutlined onClick={() => handleAddSession(dataIndex)} />
                  </Tooltip>
                  <Tooltip title="Reorder Sessions">
                    <UnorderedListOutlined onClick={() => doReorder(singleDay.sessions, singleDay)} />
                  </Tooltip>
                </Space>
                <Sessions
                  singleDay={singleDay}
                  visible={drawerVisible}
                  setVisible={setDrawerVisible}
                  itemList={itemList}
                  setItemList={setItemList}
                  doReorder={doReorder}
                />
                {i + 1 >= program.days.length ? null : <Divider />}
              </div>
            )}
          />
        </Table>
      </Card>
    </>
  ) : (
    <Skeleton />
  );
};

const Sessions = ({ visible, setVisible, itemList, setItemList, doReorder, singleDay }) => {
  // 2nd level. descendent of `days`.
  // concerned with `sessions` and passing down `presentations` nested data.
  const program = useContext(ProgramContext);
  const { getSessionById } = program;

  const history = useHistory();

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
  // console.log(`Agenda.jsx 186: Session`, singleDay.id)
  return (
    <Table
      key={singleDay.id}
      className="program-session"
      showHeader={false}
      size="small"
      style={{ marginLeft: "20px" }}
      dataSource={singleDay.sessions}
      pagination={false}>
      <Column
        title="Session Name"
        dataIndex="dateStart"
        render={(dataIndex, single, i) => (
          <div>
            <Space size={8}>
              <p>Session: {sessiondata(single).sessionsDateString}</p>
              <Tooltip title="Add Presentation">
                <PlusOutlined onClick={() => handleAddPresentation(single.id)} />
              </Tooltip>
              <Tooltip title="Reorder Presentations">
                <UnorderedListOutlined onClick={() => doReorder(single.presentations, single)} />
              </Tooltip>

              <CustomEvent event={single} type={"session"} />
            </Space>
            <Presentations props={single} />
            <p>&nbsp;</p>
          </div>
        )}
      />
    </Table>
  );
};

const Presentations = ({ props }) => {
  // 3rd level. descendent of `sessions`.
  // concerned with `presentations` nested data.

  const presdata = (p) => {
    p.presDateString = `[${moment(p.dateStart).format("HH:mm")}-${moment(p.dateEnd).format("HH:mm")}] ${p.name}`;
    return p;
  };
  // console.log(`Agenda.jsx 216: Pres`, props.id)
  return (
    <Table
      bordered
      key={props.id}
      className={`program-presentation`}
      showHeader={false}
      size="small"
      style={{ marginLeft: "20px" }}
      dataSource={props.presentations}
      pagination={false}>
      <Column
        title="Presentation"
        dataIndex="name"
        key="name"
        render={(dataIndex, single, i) => (
          <div key={i}>
            <Space size="large">
              <span>{presdata(single).presDateString}</span>
              <CustomEvent event={single} type="presentation" />
            </Space>
            <div>By: {single.presenters.join(", ")}</div>
          </div>
        )}
      />
    </Table>
  );
};

export default Agenda;
