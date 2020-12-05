import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Card } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import "./index.css";

import { AuthContext } from "../Auth/Auth";
import { Api } from "../../Api";
import Profile from "../Profile";
import Team from "../Team";
import NotFound from "../NotFound";
import TeamCreator from "../TeamCreator";
import MatchCreator from "../MatchCreator";
import TournamentCreator from "../TournamentCreator";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [teams, setTeams] = useState([]);
  const [capTeams, setCapTeams] = useState([]);
  const [capTeamsIDs, setCapTeamsIDs] = useState([]);
  let { currentUser, userData } = useContext(AuthContext);
  useEffect(() => {
    const hdrs = { headers: { "firebase-id": currentUser.uid } };
    if (userData) {
      Api.get("/players/teams/" + userData.id, hdrs)
        .then((response) => setTeams(response.data))
        .catch((err) => {
          console.log(err);
        });
      Api.get("/captain/teams/" + userData.id, hdrs)
        .then((response) => {
          setCapTeams(response.data);
          setCapTeamsIDs(response.data.map((team) => team.id));
        })
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
            <SubMenu key="teams" icon={<UserOutlined />} title="Your teams">
              {teams
                .filter((team) => !capTeamsIDs.includes(team.id))
                .map((team) => (
                  <Menu.Item key={team.id}>
                    <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                  </Menu.Item>
                ))}
            </SubMenu>
            <SubMenu
              key="capteams"
              icon={<LaptopOutlined />}
              title="Teams you lead"
            >
              {capTeams.map((team) => (
                <Menu.Item key={team.id}>
                  <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
            <SubMenu
              key="upcoming"
              icon={<CalendarOutlined />}
              title="Upcoming matches"
            ></SubMenu>
            <Menu.Item key="history" icon={<HistoryOutlined />}>
              <Link to="/dashboard/history">Match history</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<NotificationOutlined />}>
              <Link to="/dashboard/profile">Profile</Link>
            </Menu.Item>
            {!collapsed &&
            userData !== null &&
            (userData.role === "admin" || userData.role === "manager") ? (
              <Menu.Item disabled key="team_creator" className="cursor-regular">
                <TeamCreator />
              </Menu.Item>
            ) : null}

            {!collapsed &&
            userData !== null &&
            (userData.role === "admin" || userData.role === "manager") ? (
              <Menu.Item
                disabled
                key="match_creator"
                className="cursor-regular"
              >
                <MatchCreator />
              </Menu.Item>
            ) : null}

            {!collapsed &&
            userData !== null &&
            (userData.role === "admin" || userData.role === "manager") ? (
              <Menu.Item
                disabled
                key="tournament_creator"
                className="cursor-regular"
              >
                <TournamentCreator />
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
