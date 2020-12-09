import React, { useEffect, useState, useContext } from "react";
import { Layout, Card, Collapse, Typography, Spin } from "antd";
import "./index.css";

import { Api } from "../../Api";
import { AuthContext } from "../Auth/Auth";
import Tournament from "../Tournament";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Tournaments = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [tournaments, setTournaments] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    Api.get("/tournaments/", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setTournaments(result.data);
      })
      .catch((err) => {
        setTournaments(null);
        setErr(err.toString());
      });
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
                <Tournament data={tournament} />
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
