import React from "react";
import LoggedInHeader from "./Components/LoggedInHeader";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

const App = () => (
  <div className="app">
    <Router>
      <Switch>
        <Route path="/dashboard" component={LoggedInHeader} />
      </Switch>
    </Router>
  </div>
);

export default App;
