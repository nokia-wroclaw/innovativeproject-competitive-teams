import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { Avatar, Button, Col, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useContext } from "react";
import "./index.css";

import { AuthContext } from "../Auth/Auth";

const UserStatus = (props) => {
  const [color, setColor] = useState("#3f3f3f");
  const [username, setUsername] = useState(null);
  const [userLetter, setUserLetter] = useState("");
  const { currentUser, userData } = useContext(AuthContext);

  // Update userid on AuthContext change
  useEffect(() => {
    if (currentUser === null || userData === null) {
      setUserLetter("");
      setUsername(null);
    } else {
      setUsername(userData.name);
      setUserLetter(userData.name[0]);
      setColor(userData.colour);
    }
  }, [currentUser, userData]);

  const avatar = (
    <Tooltip title={username}>
      <Avatar
        style={{
          backgroundColor: color,
          verticalAlign: "middle",
          marginRight: 25,
        }}
        size="large"
      >
        {userLetter}
      </Avatar>
    </Tooltip>
  );

  const loginButton = (
    <Link to="/login">
      <Button type="primary">Sign in</Button>
    </Link>
  );

  const logoutButton = (
    <Link to="/logged-out">
      <Button type="primary" onClick={() => app.auth().signOut()}>
        Sign out
      </Button>
    </Link>
  );

  // Show avatar + sign out button when logged out, sign out button when logged out
  const av = username ? avatar : null;
  const button = username ? logoutButton : loginButton;

  return (
    <Col span={props.span} align={props.align} style={props.style}>
      {av}
      {button}
    </Col>
  );
};

export default UserStatus;
