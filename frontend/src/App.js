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
import Header from "./Components/Header";
import LoggedOut from "./Components/LoggedOut";

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Router>
          <Layout style={{ height: "100vh" }}>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/logged-out" component={LoggedOut} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
          </Layout>
        </Router>
      </div>
    </AuthProvider>
  );
};
export default App;
