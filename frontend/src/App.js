import React from "react";
import Header from "./Components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

const App = () => (
  <div className="app">
    <Router>
      <Switch>
        <Route path="/dashboard" component={Header} />
      </Switch>
    </Router>
  </div>
);

export default App;
