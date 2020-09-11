//Packages
import React from "react";
import {ReactComponent as Logo} from "./ethos.flat_.svg"

import { Layout } from "antd"

import Nav from "./Nav";
import './Head.scss';

// antd setup
const { Header } = Layout

function Head() {
	return (
		<Header>
			<div className="logo"><Logo /></div>
			<Nav />
		</Header>
	);
}

export default Head;
