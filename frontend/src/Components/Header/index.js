import React from "react";
import Dashboard from "../Dashboard";
import { Row, Col, Layout, Menu, Typography } from "antd";
import "./index.css";

const Header = () => {
  const { Header } = Layout;
  const { Title } = Typography;

  return (
    <Layout style={{ height: "100vh" }}>
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
          <Col span={16} align="left">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">Dashboard</Menu.Item>
              <Menu.Item key="2">Teams</Menu.Item>
              <Menu.Item key="3">Users</Menu.Item>
              <Menu.Item key="4">Team creation</Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Dashboard />
    </Layout>
  );
};

export default Header;
