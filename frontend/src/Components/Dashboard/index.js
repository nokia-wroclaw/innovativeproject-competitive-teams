import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Card } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import "./index.css";

import Profile from "../Profile";
import Team from "../Team";
import NotFound from "../NotFound";
import TeamCreator from "../TeamCreator";
import { getUserID } from "../Firebase_funcs/firebase_funcs";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const userid = getUserID();
  const mock_teams = [
    { id: 1, name: "team1" },
    { id: 2, name: "team2" },
    { id: 3, name: "team3" },
    { id: 4, name: "team4" },
  ];
  const mock_cap_teams = [
    { id: 5, name: "team5" },
    { id: 6, name: "team6" },
    { id: 7, name: "team7" },
    { id: 8, name: "team8" },
  ];

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
              {mock_teams.map((team) => (
                <Menu.Item key={team.id}>
                  <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<LaptopOutlined />}
              title="Teams you lead"
            >
              {mock_cap_teams.map((team) => (
                <Menu.Item key={team.id}>
                  <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
            <Menu.Item key="profile" icon={<NotificationOutlined />}>
              <Link to="/dashboard/profile">Your profile</Link>
            </Menu.Item>
            <Menu.Item disabled key="team_creator" className="cursor-regular">
              <TeamCreator />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px 24px 24px" }}>
          <Content className="site-layout-background">
            <Card>
              <Switch>
                <Route path="/dashboard/team/:teamid">
                  <Team />
                </Route>
                <Route path="/dashboard/profile">
                  <Profile userid={userid} />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Dashboard;
