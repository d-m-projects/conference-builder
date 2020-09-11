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
				style={{ marginLeft: "20px", padding: "10px" }}
				className={`program-presentation`}
				showHeader={false}
				size="small"
				dataSource={formatDataSource(presentations)}
				pagination={false}>
				<Column
					title="Presentation"
					dataIndex="name"
					key="name"
					render={(_, presentation) => (
						<div className={`program-presentation-item`}>
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
