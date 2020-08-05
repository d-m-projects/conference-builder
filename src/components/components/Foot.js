//Packages
import React from "react";
import { Link } from "react-router-dom";
// import './Foot.css';

// antd setup
import { Layout, Menu } from "antd"
const { Footer } = Layout

//Components
// import Nav from "./Nav";

function Foot() {
	return (
		<Footer style={{ textAlign: 'center' }}><h4>This is the Footer!</h4></Footer>
	);
}

export default Foot;
