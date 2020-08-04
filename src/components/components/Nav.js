//Packages
import React, {useState} from "react";
import { Link } from "react-router-dom";

import { Menu } from "antd"
import 'antd/dist/antd.css';
import './Nav.css';

//Components

const Nav = () => {
	const [current, setcurrent] = useState({current: "home"})

	const handleClick = (e) => {
		console.log(14, e);
		setcurrent({current: e.key})
	}

	return (
		<Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
			<Menu.Item key="home">
				<Link exact to="/">Home</Link>
			</Menu.Item>
			<Menu.Item key="calendar">
				<Link to="/calendar">Calendar</Link>
			</Menu.Item>
		</Menu>
	);
};

export default Nav;
