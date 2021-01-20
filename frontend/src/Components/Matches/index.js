import React, { useEffect, useState, useContext } from "react";
import {
  Layout,
  Card,
  Collapse,
  Typography,
  Spin,
  Row,
  AutoComplete,
  Pagination,
} from "antd";
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
  const [matchesOnPage, setMatchesOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMatches, setAllMatches] = useState(0);
  const [searched, setSearched] = useState("");
  const [err, setErr] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    Api.get(
      `/matches/search/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}`,
      {
        headers: { "firebase-id": fbId, name: searched },
      }
    )
      .then((result) => {
        setMatchesOnPage(result.data);
      })
      .catch((err) => {
        setMatchesOnPage(null);
        setErr(err.toString());
      });
  }, [fbId, currentPage, searched]);

  useEffect(() => {
    setCurrentPage(1);
    Api.get(`/matches_count_by_search/`, {
      headers: { "firebase-id": fbId, name: searched },
    })
      .then((result) => {
        setAllMatches(result.data);
      })
      .catch((err) => {
        setMatchesOnPage(null);
        setErr(err.toString());
      });
  }, [searched, fbId]);

  return matchesOnPage ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> Matches </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search matches"
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
            <Collapse>
              {matchesOnPage.map((match) => (
                <Panel header={`Match ${match.name}`} key={match.id}>
                  <Match id={match.id} />
                </Panel>
              ))}
            </Collapse>
          </Card>
          <Row align="center">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={pageSize}
              current={currentPage}
              onChange={setCurrentPage}
              total={allMatches}
            />
          </Row>
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
    <Layout>
      <Content className="site-layout-background">
        <Card>
          <Spin />
        </Card>
      </Content>
    </Layout>
  );
};

export default Matches;
