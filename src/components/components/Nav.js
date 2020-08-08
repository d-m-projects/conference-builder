//Packages
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Menu } from "antd"
import { CalendarOutlined, SaveOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Nav.scss';


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
				<Link to="/">Home</Link>
			</Menu.Item>
			<Menu.Item key="calendar" icon={<CalendarOutlined />}>
				<Link to="/create">Create</Link>
			</Menu.Item>
			<Menu.Item key="file" icon={<SaveOutlined />}>
				<Link to="/file">File</Link>
			</Menu.Item>
		</Menu>
	);
};

export default Nav;