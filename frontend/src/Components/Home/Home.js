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
    Api.get("/matches/?limit=5", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setMatches(result.data);
      })
      .catch((err) => {
        setMatches(null);

        setErr(err.toString());
      });
  }, [fbId]);

  return matches ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title level={1} align="center">
            {" "}
            Upcoming matches{" "}
          </Title>
          <Collapse>
            {matches.map((match) => (
              <Panel
                header={
                  <Title level={3} align="center">
                    {match.name + "  " + match.start_time}
                  </Title>
                }
                key={match.id}
                showArrow={false}
              >
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
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Spin />
        </Card>
      </Content>
    </Layout>
  );
};

export default Matches;
