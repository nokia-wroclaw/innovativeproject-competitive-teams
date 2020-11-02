import React, { useEffect, useState } from "react";
import { Row, Col, Layout, Menu, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./index.css";

import UserStatus from "./UserStatus";

const Header = () => {
  const { Header } = Layout;
  const { Title } = Typography;
  const location = useLocation();
  const [selected_keys, setSelected_keys] = useState(["0"]);

  useEffect(() => {
    const currentPath = location.pathname;
    let first_dir = currentPath.substr(1).split("/")[0];
    switch (String(first_dir)) {
      case "":
        setSelected_keys(["0"]);
        break;
      case "dashboard":
        setSelected_keys(["1"]);
        break;
      case "teams":
        setSelected_keys(["2"]);
        break;
      case "players":
        setSelected_keys(["3"]);
        break;
      case "creator":
        setSelected_keys(["4"]);
        break;
      default:
        setSelected_keys([]);
    }
  }, [location]);

  return (
    <Header className="header" style={{ padding: 0 }}>
      <Row align="center">
        <Col span={8}>
          <Title
            level={5}
            style={{
              color: "white",
              display: "inline-block",
              paddingLeft: "20px",
            }}
          >
            Competitive Teams
          </Title>
        </Col>
        <Col span={12} align="left">
          <Menu theme="dark" mode="horizontal" selectedKeys={selected_keys}>
            <Menu.Item key="0">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="1">
              <Link to="/dashboard/profile">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/teams">Teams</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/players">Players</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/creator">Team creation</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <UserStatus
          span={4}
          align={"right"}
          style={{ padding: "0px 25px 0px 0px" }}
        />
      </Row>
    </Header>
  );
};

export default Header;
