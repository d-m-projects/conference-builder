//Packages
import React from "react";

import { Layout } from "antd"

import Nav from "./Nav";
import './Head.scss';

// antd setup
const { Header } = Layout

//Components


function Head() {
	return (
		<Header>
			<div className="logo">This is the Logo in the Head!</div>
			<Nav />
		</Header>
	);
}

export default Head;
