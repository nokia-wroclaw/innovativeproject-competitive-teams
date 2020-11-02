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
  const [user_letter, setUser_letter] = useState("");

  const { currentUser } = useContext(AuthContext);

  // Update userid on AuthContext change
  useEffect(() => {
    const rgb = Math.floor(Math.random() * 16777215);
    const random_color = "#" + rgb.toString(16);
    setColor(random_color);
    if (currentUser == null) {
      setUser_letter("");
      setUserid(null);
    } else {
      setUserid(currentUser.uid);
      setUser_letter(currentUser.uid[0]);
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
        {user_letter}
      </Avatar>
    </Tooltip>
  );

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
        Sign out
      </Button>
    </Link>
  );

  // Show avatar + sign out button when logged out, sign out button when logged out
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
