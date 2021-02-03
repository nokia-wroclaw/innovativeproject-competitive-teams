import React, { useEffect, useState } from "react";
import { Row, Col, Layout, Menu, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./index.css";

import UserStatus from "./UserStatus";

const { Header } = Layout;
const { Title } = Typography;

const TeamsHeader = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(["0"]);
  const menu = [
    { link: "/", tabName: "Home" },
    { link: "/dashboard/profile", tabName: "Dashboard" },
    { link: "/teams", tabName: "Teams" },
    { link: "/players", tabName: "Players" },
    { link: "/matches", tabName: "Matches" },
    { link: "/tournaments", tabName: "Tournaments" },
  ];

  // Update menu selection based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const firstDir = currentPath.substr(1).split("/")[0];
    switch (String(firstDir)) {
      case "":
        setSelectedKeys(["0"]);
        break;
      case "dashboard":
        setSelectedKeys(["1"]);
        break;
      case "teams":
        setSelectedKeys(["2"]);
        break;
      case "players":
        setSelectedKeys(["3"]);
        break;
      case "matches":
        setSelectedKeys(["4"]);
        break;
      case "tournamnets":
        setSelectedKeys(["5"]);
        break;
      default:
        setSelectedKeys([]);
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
          <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys}>
            {menu.map((menuItem, i) => (
              <Menu.Item key={i}>
                <Link to={menuItem.link}>{menuItem.tabName}</Link>
              </Menu.Item>
            ))}
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

export default TeamsHeader;
