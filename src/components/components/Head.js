//Packages
import React from "react";
import { Link } from "react-router-dom";

import { Layout, Menu } from "antd"

import Nav from "./Nav";
// import './Head.css';

// antd setup
const { Header } = Layout

//Components


function Head() {
	return (
		<Header>
			<div className="logo" />
			<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
				<Menu.Item key="1">nav 1</Menu.Item>
				<Menu.Item key="2">nav 2</Menu.Item>
				<Menu.Item key="3">nav 3</Menu.Item>
			</Menu>
		</Header>
	);
}

export default Head;
