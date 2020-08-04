//Packages
import React from "react";
import { Link } from "react-router-dom";
//Components

const Nav = () => {
  return (
    <div>
      <Link exact to="/">
        Home
      </Link>
      <Link to="/calendar">Calendar</Link>
    </div>
  );
};

export default Nav;
