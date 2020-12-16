import React, { useEffect, useState, useContext } from "react";
import { Layout, Card, Collapse, Typography, Spin } from "antd";
import "./index.css";

import { Api } from "../../Api";
import Match from "../Match";

import { AuthContext } from "../Auth/Auth";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;
const Matches = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [matches, setMatches] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    Api.get("/matches/", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setMatches(result.data);
      })
      .catch((err) => {
        setMatches(null);
        setErr(err.toString());
      });
  }, [fbId]);

  return matches ? (
    <Layout style={{ padding: "24px 24px 24px" }}>
      <Content className="site-layout-background">
        <Card>
          <Title> List of matches </Title>
          <Collapse>
            {matches.map((match) => (
              <Panel header={"Match " + match.name} key={match.id}>
                <Match id={match.id} />
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
    </Layout>
  ) : err ? (
    <Title>
      Api request failed for the list of matches.
      <br />
      {err}
    </Title>
  ) : (
    <Layout style={{ padding: "24px 24px 24px" }}>
      <Content className="site-layout-background">
        <Card>
          <Spin />
        </Card>
      </Content>
    </Layout>
  );
};

export default Matches;
