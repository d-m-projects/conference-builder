import React from "react";

// antd components
import { Table, Space } from "antd";

import EditDeleteWidget from "./EditDeleteWidget";

import { formatDataSource } from "./formatDataSource";

const { Column } = Table;

function Presentations({ presentations }) {
  // 3rd level. descendent of `sessions`.
  // concerned with `presentations` nested data.

  // Format presentation data for output
  const presdata = (p) => {
    p.presDateString = `${p.name}`;
    return p;
  };

  return (
    <Table
      bordered
      className={`program-presentation`}
      showHeader={false}
      size="small"
      style={{ marginLeft: "20px" }}
      dataSource={formatDataSource(presentations)}
      pagination={false}>
      <Column
        title="Presentation"
        dataIndex="name"
        key="name"
        render={(_, presentation) => (
          <div>
            <Space size={8}>
              <span>{presentation.name}</span>
              <EditDeleteWidget event={presentation} type="presentation" />
            </Space>
            <div>By: {presentation.presenters.join(", ")}</div>
          </div>
        )}
      />
    </Table>
  );
}

export default Presentations;
