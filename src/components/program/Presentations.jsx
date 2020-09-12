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

	const creditDisplay = (presentation) => {
		if (presentation.credits) {
			const sortedPairs = Object.entries(presentation.credits).sort();

			if (sortedPairs.length > 0) {
				let creditString = "";

				for (const [key, value] of sortedPairs) {
					creditString += `${key}: ${value}, `;
				}

				creditString = creditString.slice(0, creditString.length - 2);

				return <div>Credits: {creditString}</div>;
			}
		}
		return null;
	};

	return (
		<Table
			style={{ marginLeft: "20px", padding: "10px 0 0 10px" }}
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
					<div className={`presentationItems`}>
						<Space size={8}>
							<span>{presentation.name}</span>
							<EditDeleteWidget event={presentation} type="presentation" />
						</Space>
						{creditDisplay(presentation)}
						<div>Presenters: {presentation.presenters.join(", ")}</div>
					</div>
				)}
			/>
		</Table>
	);
}

export default Presentations;
