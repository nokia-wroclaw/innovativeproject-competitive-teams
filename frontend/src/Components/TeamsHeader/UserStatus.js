import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { Avatar, Button, Col, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useContext } from "react";
import "./index.css";

import { AuthContext } from "../Auth/Auth";

const UserStatus = (props) => {
  const [color, setColor] = useState("#3f3f3f");
  const [userid, setUserid] = useState(null);
  const [userLetter, setUserLetter] = useState("");

  const { currentUser } = useContext(AuthContext);

  // Update userid on AuthContext change
  useEffect(() => {
    const rgb = Math.floor(Math.random() * 16777215);
    const random_color = "#" + rgb.toString(16);
    setColor(random_color);
    if (currentUser === null) {
      setUserLetter("");
      setUserid(null);
    } else {
      setUserid(currentUser.uid);
      setUserLetter(currentUser.uid[0]);
    }
  }, [currentUser]);

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
  const av = userid ? avatar : null;
  const button = userid ? logoutButton : loginButton;

  return (
    <Col span={props.span} align={props.align} style={props.style}>
      {av}
      {button}
    </Col>
  );
};

export default UserStatus;
