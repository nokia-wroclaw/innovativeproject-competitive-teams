import React, { useEffect, useState } from "react";
import { Layout, Card, Collapse, Typography } from "antd";
import "./index.css";

import { Api } from "../../Api";
import Team from "../Team";

const Teams = () => {
  const { Content } = Layout;
  const { Panel } = Collapse;
  const { Title } = Typography;
  const [teams, setTeams] = useState(null);
  const [team_panels, setTeam_panels] = useState(null);

  useEffect(() => {
    Api.get("/teams/")
      .then((result) => {
        setTeams(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (teams) {
      let panels = [];
      for (const team of teams) {
        panels.push(
          <Panel header={"Team " + team.name} key={team.id}>
            <Team teamdata={team} />
          </Panel>
        );
      }
      setTeam_panels(panels);
    }
  }, [teams]);

  return (
    <Layout style={{ padding: "24px 24px 24px" }}>
      <Content className="site-layout-background">
        <Card>
          <Title> List of teams </Title>
          <Collapse>{team_panels}</Collapse>
        </Card>
      </Content>
    </Layout>
  );
};

export default Teams;
