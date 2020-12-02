import React, { useEffect, useState, useContext } from "react";
import { Layout, Card, Collapse, Typography, Spin } from "antd";
import "./index.css";

import Tournament from "../Tournament";

import { AuthContext } from "../Auth/Auth";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Tournaments = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [tournaments, setTournaments] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (fbId) setTournaments([{ name: "se bracket example", id: 0 }]);
    else setErr(`fbId ${fbId}`);
  }, [fbId]);

  return tournaments ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> List of tournaments </Title>
          <Collapse>
            {tournaments.map((tournament) => (
              <Panel
                header={"Tournament " + tournament.name}
                key={tournament.id}
              >
                <Tournament id={tournament.id} />
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
    </Layout>
  ) : err ? (
    <Title>
      Api request failed for the list of tournaments.
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

export default Tournaments;
