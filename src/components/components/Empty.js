//Packages
import React from "react";

// antd setup
import { SmileOutlined } from '@ant-design/icons';


//Components

function renderNoData() {
	return (
		<div style={{ textAlign: 'center' }}>
			<SmileOutlined style={{ fontSize: 20 }} />
			<p>Data Not Found</p>
		</div>
	)
}

export default renderNoData;
