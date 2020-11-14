import React, { useEffect, useState } from "react";
import { Layout, Card, Collapse, Typography, Spin } from "antd";
import "./index.css";

import { Api } from "../../Api";
import Team from "../Team";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Teams = () => {
  const [teams, setTeams] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    Api.get("/teams/")
      .then((result) => {
        setTeams(result.data);
      })
      .catch((err) => {
        setTeams(null);
        setErr(err.toString());
      });
  }, []);

  return teams ? (
    <Layout style={{ padding: "24px 24px 24px" }}>
      <Content className="site-layout-background">
        <Card>
          <Title> List of teams </Title>
          <Collapse>
            {teams.map((team) => (
              <Panel header={"Team " + team.name} key={team.id}>
                <Team id={team.id} />
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
    </Layout>
  ) : err ? (
    <Title>
      Api request failed for the list of teams.
      <br />
      {err}
    </Title>
  ) : (
    <Spin />
  );
};

export default Teams;
