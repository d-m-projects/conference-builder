import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import moment from "moment";

// antd components
import { Skeleton, Table, Card, Button, Space, Tooltip, Divider } from "antd";
import { PlusOutlined, UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";

// Components
import { VIEW } from "../forms/FormManager";
import ReorderDnD from "./AgendaForm/ReorderDnD";
import Sessions from "./Sessions";
import ProgramModal from "../Modals/ProgramModal";

import { formatDataSource } from "./formatDataSource";

// Dev test data
// import injection from "../../data/testdata";

const { Column } = Table;

function Agenda() {
  // Top level of the agenda
  // concerned with `days` and passing down `sessions` nested data.

  const program = useContext(ProgramContext);

  const history = useHistory();

  // State for dynamic item list
  const [itemList, setItemList] = useState([]);
  const [single, setSingle] = useState({});

  // Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Edit Program Modal
  const [modalVisible, setModalVisible] = useState(false);

  // DEV ONLY (by darrin)
  // if `program` is empty, fill it with example data for visualization.
  // Use when you need complete data in `program`
  // (so you don't have to enter it manually)
  if (!program.dateStart) {
  	program.injectTestData()
  }

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
      <ProgramModal visible={modalVisible} setVisible={setModalVisible} />
      <ReorderDnD
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        itemList={itemList}
        setItemList={setItemList}
        single={single}
      />

      <Card title={programHeader(program)} extra={programHeaderDateRange(program)}>
        <Table
          className="program-agenda"
          showHeader={false}
          size="small"
          dataSource={formatDataSource(program.days)}
          pagination={false}>
          <Column
            title="Date"
            dataIndex="date"
            render={(date, day, i) => (
              <div>
                <Space size={8}>
                  <p>Program Day: {moment(date).format("ddd, MMM Do Y")}</p>
                  <Tooltip title="Add Session">
                    <PlusOutlined onClick={() => handleAddSession(date)} />
                  </Tooltip>
                  <Tooltip title="Reorder Sessions">
                    <UnorderedListOutlined onClick={() => doReorder(day.sessions, day)} />
                  </Tooltip>
                </Space>
                <Sessions sessions={day.sessions} doReorder={doReorder} />
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
}

export default Agenda;
