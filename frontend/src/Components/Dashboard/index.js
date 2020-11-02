import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import "./index.css";

import Profile from "../Profile";
import Team from "../Team";
import NotFound from "../NotFound";
import { getUserID } from "../Firebase_funcs/firebase_funcs";

const DashboardSider = () => {
  const { Content, Sider } = Layout;
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = useState(false);
  const userid = getUserID();

  return (
    <Router>
      <Layout>
        <Sider
          theme="dark"
          collapsible
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width={250}
          className="site-layout-background"
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["0"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Your teams">
              <Menu.Item key="1">
                <Link to="/dashboard/team/team1">team1</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/dashboard/team/team2">team2</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/dashboard/team/team3">team3</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/dashboard/team/team4">team4</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<LaptopOutlined />}
              title="Teams you lead"
            >
              <Menu.Item key="5">
                <Link to="/dashboard/team/team5">team5</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/dashboard/team/team6">team6</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/dashboard/team/team7">team7</Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/dashboard/team/team8">team8</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="0" icon={<NotificationOutlined />}>
              <Link to="/dashboard/profile">Your profile</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Switch>
              <Route path="/dashboard/team/:teamid">
                <Team />
              </Route>
              <Route path="/dashboard/profile">
                <Profile userid={userid} />
              </Route>
              <Route exact path="/dashboard">
                <Profile userid={userid} />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default DashboardSider;
