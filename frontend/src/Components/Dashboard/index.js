import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { Layout, Menu, Card, Spin } from "antd";
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
import UpcomingMatches from "../UpcomingMatches";
import History from "../History";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [capTeamsIDs, setCapTeamsIDs] = useState([]);
  let { currentUser, userData } = useContext(AuthContext);
  const hdrs = { headers: { "firebase-id": currentUser.uid } };

  const { data: capTeams } = useQuery(
    ["capTeams", currentUser, userData],
    async () => {
      const res = await Api.get("/captain/teams/" + userData.id, hdrs);
      setCapTeamsIDs(res.data.map((team) => team.id));
      return res.data;
    },
    {
      enabled: !!userData,
    }
  );

  const { data: teams } = useQuery(
    ["teams", currentUser, userData],
    async () => {
      const res = await Api.get("/players/teams/" + userData.id, hdrs);
      return res.data;
    },
    {
      enabled: !!userData && capTeams !== undefined,
    }
  );

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
              {teams ? (
                teams
                  .filter((team) => !capTeamsIDs.includes(team.id))
                  .map((team) => (
                    <Menu.Item key={team.id}>
                      <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                    </Menu.Item>
                  ))
              ) : (
                <Menu.Item key="loading teams">
                  <Spin />
                </Menu.Item>
              )}
            </SubMenu>
            <SubMenu
              key="capteams"
              icon={<LaptopOutlined />}
              title="Teams you lead"
            >
              {capTeams ? (
                capTeams.map((team) => (
                  <Menu.Item key={team.id}>
                    <Link to={"/dashboard/team/" + team.id}>{team.name}</Link>
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item key="loading capTeams">
                  <Spin />
                </Menu.Item>
              )}
            </SubMenu>
            <Menu.Item
              key="upcoming"
              icon={<CalendarOutlined />}
              title="Upcoming matches"
            >
              <Link to="/dashboard/upcoming">Upcoming Matches</Link>
            </Menu.Item>
            <Menu.Item key="history" icon={<HistoryOutlined />} title="history">
              <Link to="/dashboard/history">Match history</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<NotificationOutlined />}>
              <Link to="/dashboard/profile">Profile</Link>
            </Menu.Item>

            {!collapsed &&
            userData !== null &&
            (userData.role === "admin" || userData.role === "manager")
              ? [
                  <Menu.Item
                    disabled
                    key="team_creator"
                    className="cursor-regular"
                  >
                    <TeamCreator />
                  </Menu.Item>,

                  <Menu.Item
                    disabled
                    key="match_creator"
                    className="cursor-regular"
                  >
                    <MatchCreator />
                  </Menu.Item>,

                  <Menu.Item
                    disabled
                    key="tournament_creator"
                    className="cursor-regular"
                  >
                    <TournamentCreator />
                  </Menu.Item>,
                ]
              : null}
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
                <Route path="/dashboard/history">
                  <History userid={currentUser.uid} />
                </Route>
                <Route path="/dashboard/upcoming">
                  <UpcomingMatches userid={currentUser.uid} />
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
