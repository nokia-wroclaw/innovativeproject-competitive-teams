import React, { useEffect, useState, useContext } from "react";
import {
  Layout,
  Card,
  Collapse,
  Typography,
  Spin,
  AutoComplete,
  Row,
} from "antd";
import "./index.css";

import { Api } from "../../Api";
import Team from "../Team";

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
    Api.get("/teams/", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setTeams(result.data);
      })
      .catch((err) => {
        setTeams(null);
        setErr(err.toString());
      });
  }, [fbId]);

  const handleSearch = (value) => {
    Api.get("/teams/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) => {
      setTeams(result.data);
    });
  };
  return teams ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> List of teams </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search teams"
              onChange={handleSearch}
              style={{ width: 200 }}
            />
          </Row>
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
