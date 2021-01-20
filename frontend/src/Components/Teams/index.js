import React, { useEffect, useState, useContext } from "react";
import {
  Layout,
  Card,
  Collapse,
  Typography,
  Spin,
  AutoComplete,
  Row,
  Pagination,
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
  const [err, setErr] = useState(null);
  const [teamsOnPage, setTeamsOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allTeams, setAllTeams] = useState(0);
  const [searched, setSearched] = useState("");
  const pageSize = 10;

  useEffect(() => {
    Api.get(
      `/teams/search/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}`,
      {
        headers: { "firebase-id": fbId, name: searched },
      }
    )
      .then((result) => {
        setTeamsOnPage(result.data);
      })
      .catch((err) => {
        setTeamsOnPage(null);
        setErr(err.toString());
      });
  }, [fbId, currentPage, searched]);

  useEffect(() => {
    setCurrentPage(1);
    Api.get(`/teams_count_by_search/`, {
      headers: { "firebase-id": fbId, name: searched },
    })
      .then((result) => {
        setAllTeams(result.data);
      })
      .catch((err) => {
        setTeamsOnPage(null);
        setErr(err.toString());
      });
  }, [searched, fbId]);

  return teamsOnPage ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> Teams </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search teams"
              onChange={setSearched}
              style={{ width: 200 }}
            />
          </Row>

          <Card
            bordered={false}
            bodyStyle={{
              height: 520,
              overflow: "auto",
            }}
          >
            <Collapse accordion>
              {teamsOnPage.map((team) => (
                <Panel header={`Team ${team.name}`} key={team.id}>
                  <Team id={team.id} />
                </Panel>
              ))}
            </Collapse>
          </Card>

          <Row align="center" span={4}>
            <Pagination
              defaultCurrent={1}
              defaultPageSize={pageSize}
              onChange={setCurrentPage}
              total={allTeams}
              current={currentPage}
            />
          </Row>
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
