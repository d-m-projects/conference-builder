//Packages
import React from "react";
import { Link } from "react-router-dom";

import { Menu } from "antd"
import 'antd/dist/antd.css';
import './Nav.css';

//Components

const Nav = () => {

	const handleClick = () => { }

	return (
		<Menu onClick={handleClick} mode="horizontal">
			<Menu.Item>
				<Link exact to="/">Home</Link>
			</Menu.Item>
			<Menu.Item>
				<Link to="/calendar">Calendar</Link>
			</Menu.Item>
		</Menu>
	);
};

export default Nav;
