//Packages
import React from "react";
import { Link } from "react-router-dom";
//Components

import Nav from "./Nav";

function Header() {
  return (
    <div>
      <div>
        <Link to="/">
          <h4>This is the Header!</h4>
        </Link>
      </div>
      <Nav />
    </div>
  );
}

export default Header;
