import React, { useEffect, useState, useContext } from "react";
import { Layout, Card, Collapse, Typography, Spin } from "antd";
import "./index.css";
import { Api } from "../../Api";
import Player from "../Player";

import { AuthContext } from "../Auth/Auth";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Players = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [players, setPlayers] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    Api.get("/players/", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setPlayers(result.data);
      })
      .catch((err) => {
        setPlayers(null);
        setErr(err.toString());
      });
  }, [fbId]);

  return players ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> List of players </Title>
          <Collapse>
            {players.map((player) => (
              <Panel header={"Player " + player.name} key={player.id}>
                <Player id={player.id} />
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
    </Layout>
  ) : err ? (
    <Title>
      Api request failed for the list of players.
      <br />
      {err}
    </Title>
  ) : (
    <Layout>
      <Content className="site-layout-background">
        <Card>
          <Spin />
        </Card>
      </Content>
    </Layout>
  );
};

export default Players;
