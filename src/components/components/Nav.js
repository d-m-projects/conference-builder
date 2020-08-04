//Packages
import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { A } from "hookrouter";

import { Menu } from "antd"
import { CalendarOutlined, SaveOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Nav.css';


//Components

const Nav = () => {
	const [current, setcurrent] = useState({ current: "home" })

	const handleClick = (e) => {
		console.log(14, e);
		setcurrent({ current: e.key })
	}

	return (
		<Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" defaultSelectedKeys={["Home"]}>
			<Menu.Item key="home">
				<A href="/">Home</A>
			</Menu.Item>
			<Menu.Item key="calendar" icon={<CalendarOutlined />}>
				<A href="/calendar">Calendar</A>
			</Menu.Item>
			<Menu.Item key="file" icon={<SaveOutlined />}>
				<A href="/file">File</A>
			</Menu.Item>
		</Menu>
	);
};

export default Nav;
