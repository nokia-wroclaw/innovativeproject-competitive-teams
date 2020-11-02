import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { Avatar, Button, Col, Tooltip } from "antd";
import { Link } from "react-router-dom";
import "./index.css";

const UserStatus = (props) => {
  const [color, setColor] = useState("#3f3f3f");
  const userid = props.userid;
  const user_letter = userid ? userid[0] : "";

  const avatar = (
    <Tooltip title={userid}>
      <Avatar
        style={{
          backgroundColor: color,
          verticalAlign: "middle",
          marginRight: 25,
        }}
        size="large"
      >
        {user_letter}
      </Avatar>
    </Tooltip>
  );

  useEffect(() => {
    const rgb = Math.floor(Math.random() * 16777215);
    const random_color = "#" + rgb.toString(16);
    setColor(random_color);
  }, [props.userid]);

  const login_button = (
    <Link to="/login">
      <Button type="primary">Sign in</Button>
    </Link>
  );

  const logout_button = (
    <Link to="/logged-out">
      <Button
        type="primary"
        onClick={() => {
          app.auth().signOut();
        }}
      >
        Log out
      </Button>
    </Link>
  );

  const av = userid ? avatar : null;
  const button = userid ? logout_button : login_button;
  return (
    <Col span={props.span} align={props.align} style={props.style}>
      {av}
      {button}
    </Col>
  );
};

export default UserStatus;
