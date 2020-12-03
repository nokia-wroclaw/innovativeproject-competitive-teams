import React, { useEffect, useState, useContext } from "react";
import { Layout, Card, Collapse, Typography, Spin } from "antd";
import "./index.css";

import { Api } from "../../Api";
import Match from "../Match";

import { AuthContext } from "../Auth/Auth";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Teams = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [teams, setTeams] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    Api.get("/matches/?limit=3", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setTeams(result.data);
      })
      .catch((err) => {
        setTeams(null);
        setErr(err.toString());
      });
  }, [fbId]);

  return teams ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title align="center"> Upcoming matches </Title>
          <Collapse>
            {teams.map((team) => (
              <Panel
                header={team.name + "       " + team.start_time}
                key={team.id}
                showArrow={false}
              >
                <Match id={team.id} />
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
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Spin />
        </Card>
      </Content>
    </Layout>
  );
};

export default Teams;
