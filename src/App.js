//Packages
import React, { useContext, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { Switch, Redirect, useHistory, withRouter } from "react-router-dom";
import { ProgramContext } from "./contexts/Program";

import db from "./data/database"

import Dashboard from "./components/dashboard/";
import Create from "./components/create/";
import File from "./components/file/";
import LandingPage from "./components/landing-page";
import Head from "./components/components/Head";
import Foot from "./components/components/Foot";

//Style
import "./App.scss";

// antd setup
import { /*Breadcrumb, Grid,*/ Modal, Button, message, Col, Layout, Row } from "antd";
import "antd/dist/antd.css";

import "react-big-calendar/lib/sass/styles.scss";

const { Content } = Layout;

// const { useBreakpoint } = Grid;
// Components
function App() {
	const [running, setRunning] = useState(0)
	const program = useContext(ProgramContext);
	const { loadProgress, createProgram } = program;
	const history = useHistory()

	function continuePrompt() {
		Modal.info({
			title: program.name,
			content: "You have an unfinished program. Let's continue!",
			okText: "Continue...",
		});
	}

	function tooManyTabs() {
		const modal = Modal.error({
			title: 'Open in another tab or window.',
			content: `Please close this tab and try to find the one that is already open. Your progress has not been lost.`,
			okButtonProps: { disabled: true },
			okText: "Close other tabs"
		});
	}

	useEffect(() => {
		db.start()
		db.read(1)
			.then((res) => {
				if (res.dateStart && !running) {
					if (res.tooManyTabs) {
						tooManyTabs()
						// res.tooManyTabs = 0
						// db.tooManyTabs(res)
						return
					}
					loadProgress(res)
					setRunning(1)
					continuePrompt() // commented for dev mode
					// message.info("Previous creation progress\nLoaded!");
					history.push("/create")
				} else {
					console.log(`New Program`)
					setRunning(1)
				}
			})
			.then ((res) => {
			})
			.catch((err) => console.error(`App.js 46: `, err))

	}, [])

	//   const screens = useBreakpoint(); // for setting up responsiveness
	return (

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
									{/* <Route path="/create" component={Create} running={running} /> */}
									<Route path="/create">
										<Create running={running} />
									</Route>
									<Route path="/dashboard" component={Dashboard} />
									<Route path="/file" component={File} />
								</Switch>
							</div>
						</Content>
						<Foot />
					</Col>
				</Row>
			</Layout>

	);
}

export default withRouter(App);
