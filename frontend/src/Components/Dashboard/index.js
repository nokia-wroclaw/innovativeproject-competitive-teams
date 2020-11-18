import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Card } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import "./index.css";

import { AuthContext } from "../Auth/Auth";
import { Api } from "../../Api";
import Profile from "../Profile";
import Team from "../Team";
import NotFound from "../NotFound";
import TeamCreator from "../TeamCreator";
import MatchCreator from "../MatchCreator";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [teams, setTeams] = useState([]);
  const [capTeams, setCapTeams] = useState([]);
  const { currentUser, userData } = useContext(AuthContext);

  useEffect(() => {
    const hdrs = { headers: { "firebase-id": currentUser.uid } };
    if (userData) {
      Api.get("/players/teams/" + userData.id, hdrs)
        .then((response) => setTeams(response.data))
        .catch((err) => {
          console.log(err);
        });
      Api.get("/captain/teams/" + userData.id, hdrs)
        .then((response) => setCapTeams(response.data))
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser, userData]);

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
            defaultSelectedKeys={["profile"]}
            defaultOpenKeys={[]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Your teams">
              {teams.map((team) => (
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
              {capTeams.map((team) => (
                <Menu.Item key={team.id}>
                  <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
            <Menu.Item key="profile" icon={<NotificationOutlined />}>
              <Link to="/dashboard/profile">Your profile</Link>
            </Menu.Item>
            {userData !== null &&
            (userData.role === "admin" || userData.role === "organizer") ? (
              <Menu.Item disabled key="team_creator" className="cursor-regular">
                <TeamCreator />
              </Menu.Item>
            ) : null}

            {userData !== null &&
            (userData.role === "admin" || userData.role === "organizer") ? (
              <Menu.Item
                disabled
                key="match_creator"
                className="cursor-regular"
              >
                <MatchCreator />
              </Menu.Item>
            ) : null}
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
                  <Profile userid={currentUser.uid} />
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
