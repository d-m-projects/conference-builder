//Packages
import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useRoutes } from "hookrouter";

import Dashboard from "./components/dashboard/index";
import Calendar from "./components/dashboard/components/Calendar";
import LandingPage from "./components/landing-page";
import File from "./components/file/"
import Head from "./components/components/Head";
import Foot from "./components/components/Foot";

//Style
import "./App.scss";

// antd setup
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
const { Header, Content, Footer } = Layout

// Components
function App() {
	return (
		<Layout className="layout" theme="light" >
			<Router>
				<Head />
				<Content style={{ padding: '0 50px' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>Home</Breadcrumb.Item>
						<Breadcrumb.Item>List</Breadcrumb.Item>
						<Breadcrumb.Item>App</Breadcrumb.Item>
					</Breadcrumb>
					{/* <div style={{ backgroundColor: "white", padding: "20px", height: "200px" }}>Content</div> */}
					<div style={{ backgroundColor: "white", padding: "20px", height: "200px" }}>
						<Switch>
							<Route exact path="/" component={LandingPage} />
							<Route path="/calendar" component={Calendar} />
							<Route path="/dashboard" component={Dashboard} />
						</Switch>
					</div>
				</Content>
				<Foot />
			</Router>
		</Layout>
	)
	//   return (
	//     <div>
	//       <Router>
	//         <Header />
	//         <Route exact path="/" component={LandingPage} />
	//         <Route path="/calendar" component={Calendar} />
	//         <Route path="/dashboard" component={Dashboard} />
	//       	<Footer />
	//       </Router>
	//     </div>
	//   );
}

export default App;
