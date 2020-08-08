//Packages
import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Dashboard from "./components/dashboard/";
import Create from "./components/create/";
import File from "./components/file/";
import LandingPage from "./components/landing-page";
import Head from "./components/components/Head";
import Foot from "./components/components/Foot";

//Style
import "./App.scss";

// antd setup
import { /*Breadcrumb, Grid,*/ Col, Layout, Row } from "antd";
import "antd/dist/antd.css";

import "react-big-calendar/lib/sass/styles.scss";

const { Content } = Layout;

// const { useBreakpoint } = Grid;

// Components
function App() {
	//   const screens = useBreakpoint(); // for setting up responsiveness
	return (
		<Router>
			<Layout className="layout" theme="light">
				<Row>
					<Col span={24}>
						<Head />
						<Content style={{ margin: "50px" }}>
							{/* <Breadcrumb style={{ margin: '16px 0' }}>
								<Breadcrumb.Item>Home</Breadcrumb.Item>
								<Breadcrumb.Item>List</Breadcrumb.Item>
								<Breadcrumb.Item>App</Breadcrumb.Item>
							</Breadcrumb> */}
							<div style={{ backgroundColor: "white", padding: "20px" }}>
								<Switch>
									<Route exact path="/" component={LandingPage} />
									<Route path="/create" component={Create} />
									<Route path="/dashboard" component={Dashboard} />
									<Route path="/file" component={File} />
								</Switch>
							</div>
						</Content>
						<Foot />
					</Col>
				</Row>
			</Layout>
		</Router>
	);
}

export default App;