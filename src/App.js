//Packages
import React from "react";
import { Route } from "react-router-dom";
import { Switch, withRouter } from "react-router-dom";

import Dashboard from "./components/dashboard/";
import File from "./components/file/";
import LandingPage from "./components/landing-page";
import ProgramPage from "./components/program/ProgramPage";
import Agenda from "./components/program/Agenda";
import Head from "./components/components/Head";
import Foot from "./components/components/Foot";

// antd setup
import { Col, Layout, Row } from "antd";
import "antd/dist/antd.css";

// Local styles overwriting antd
import "./App.scss";

import "react-big-calendar/lib/sass/styles.scss";

const { Content } = Layout;

function App() {
  return (
    <Layout className="layout" theme="light">
      <Row>
        <Col span={24}>
          <Head />
          <Content style={{ margin: "50px" }}>
            <div style={{ backgroundColor: "white", padding: "20px" }}>
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/review" component={Agenda} />
                <Route path="/program" component={ProgramPage} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/manager" component={File} />
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
