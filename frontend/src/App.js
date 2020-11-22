import React from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import { AuthProvider } from "./Components/Auth/Auth";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Dashboard from "./Components/Dashboard";
import TeamsHeader from "./Components/TeamsHeader";
import LoggedOut from "./Components/LoggedOut";
import Teams from "./Components/Teams";
import Players from "./Components/Players";

const App = () => (
  <AuthProvider>
    <div className="app">
      <Router>
        <Layout style={{ height: "100%", minHeight: "100vh" }}>
          <TeamsHeader />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/logged-out" component={LoggedOut} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route exact path="/teams" component={Teams} />
            <Route exact path="/players" component={Players} />
          </Switch>
        </Layout>
      </Router>
    </div>
  </AuthProvider>
);
export default App;
