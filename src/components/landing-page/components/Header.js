//Packages
import React from "react";
import { Link } from "react-router-dom";

import './Header.css';



//Components

import Nav from "./Nav";

function Header() {
	return (
		<header>
			<div>
				<Link to="/">
					<h4>This is the Header!</h4>
				</Link>
			</div>
			<Nav />
		</header>
	);
}

export default Header;
