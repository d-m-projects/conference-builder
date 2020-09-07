//Packages
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Menu } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./Nav.scss";

const Nav = () => {
  const [current, setcurrent] = useState({ current: "home" });

  const handleClick = (e) => {
    setcurrent({ current: e.key });
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" defaultSelectedKeys={["Home"]}>
      <Menu.Item key="home">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="calendar" icon={<CalendarOutlined />}>
        <Link to="/manager">Programs</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Nav;
