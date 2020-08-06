//Packages
import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Dashboard from "./components/dashboard/index";
import Create from "./components/Create";
import LandingPage from "./components/landing-page";
import Head from "./components/components/Head";
import Foot from "./components/components/Foot";

//Style
import "./App.scss";

// antd setup
import { Layout, Breadcrumb, Grid, Row, Col } from 'antd';
import 'antd/dist/antd.css';
const { Content } = Layout

const { useBreakpoint } = Grid

// Components
function App() {
	const screens = useBreakpoint();
	return (
		<Layout className="layout" theme="light" >
			<Router>
				<Row>
					<Col span={24}>
						{console.log(27, screens)}
						<Head />
						<Content style={{ padding: '0 50px' }}>
							{/* <Breadcrumb style={{ margin: '16px 0' }}>
								<Breadcrumb.Item>Home</Breadcrumb.Item>
								<Breadcrumb.Item>List</Breadcrumb.Item>
								<Breadcrumb.Item>App</Breadcrumb.Item>
							</Breadcrumb> */}
							<div style={{ backgroundColor: "white", padding: "20px", height: "200px" }}>
								<Switch>
									<Route exact path="/" component={LandingPage} />
									<Route path="/create" component={Create} />
									<Route path="/dashboard" component={Dashboard} />
								</Switch>
							</div>
						</Content>
						<Foot />
					</Col>
				</Row>
			</Router>
		</Layout>
	)
}

export default App;
