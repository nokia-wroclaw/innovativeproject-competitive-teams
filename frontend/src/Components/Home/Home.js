import React from "react";
import app from "../Base/base";
import { loggedIn } from "../Firebase_funcs/firebase_funcs";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import "./index.css";

const Home = () => {
  const history = useHistory();

  let button;
  if (loggedIn())
    button = (
      <Button
        type="primary"
        onClick={() => {
          app.auth().signOut();
          history.push("/logged-out");
        }}
      >
        Sign out
      </Button>
    );
  else
    button = (
      <Button
        type="primary"
        onClick={() => {
          app.auth().signOut();
          history.push("/login");
        }}
      >
        Sign in
      </Button>
    );

  return (
    <>
      <h1>Home</h1>
      {button}
    </>
  );
};

export default Home;
