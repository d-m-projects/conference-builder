import React from "react";

// antd components
import { Table, Space, ConfigProvider } from "antd";

// Components
import EditDeleteWidget from "./EditDeleteWidget";
import { formatDataSource } from "./formatDataSource";
import renderNoData from "../components/NoData"

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
		<ConfigProvider renderEmpty={() => renderNoData({ type: "presentation" })}>
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
							<Space size="large">
								<span>{presentation.name}</span>
								<EditDeleteWidget event={presentation} type="presentation" />
							</Space>
							<div>By: {presentation.presenters.join(", ")}</div>
						</div>
					)}
				/>
			</Table>
		</ConfigProvider>

	);
}

export default Presentations;
