//Style
import "./App.css";

//Packages
import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./components/dashboard/index";
import Calendar from "./components/dashboard/components/Calendar";
import LandingPage from "./components/landing-page";
import Header from "./components/landing-page/components/Header";
import Footer from "./components/landing-page/components/Footer";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Route exact path="/" component={LandingPage} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/dashboard" component={Dashboard} />
      </Router>
      <Footer />
    </div>
  );
}

export default App;
