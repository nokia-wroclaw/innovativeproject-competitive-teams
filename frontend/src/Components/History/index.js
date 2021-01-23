import React, { useEffect, useState, useContext } from "react";
import {
  Layout,
  Card,
  Collapse,
  Typography,
  Spin,
  Row,
  Pagination,
} from "antd";
import "./index.css";
import { Api } from "../../Api";
import Match from "../Match";
import { AuthContext } from "../Auth/Auth";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;
const History = () => {
  let { currentUser, userData } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const [matchesOnPage, setMatchesOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [err, setErr] = useState(null);
  const [allMatches, setAllMatches] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (userData) {
      Api.get(
        `/personal_finished_matches/${userData.id}?skip=${
          (currentPage - 1) * pageSize
        }&limit=${pageSize}`,
        {
          headers: { "firebase-id": fbId },
        }
      )
        .then((result) => {
          setMatchesOnPage(result.data);
        })
        .catch((err) => {
          setMatchesOnPage(null);
          setErr(err.toString());
        });
    }
  }, [fbId, currentPage, userData]);

  useEffect(() => {
    if (userData) {
      Api.get(`/count_personal_finished_matches/${userData.id}`, {
        headers: { "firebase-id": fbId },
      })
        .then((result) => {
          setAllMatches(result.data);
        })
        .catch((err) => {
          setMatchesOnPage(null);
          setErr(err.toString());
        });
    }
  }, [fbId, userData]);

  return matchesOnPage ? (
    <Card
      bordered={false}
      bodyStyle={{
        height: "80vh",
      }}
    >
      <Title> List of matches </Title>
      <Card
        bordered={false}
        bodyStyle={{
          height: "65vh",
          overflow: "auto",
        }}
      >
        <Collapse>
          {matchesOnPage.map((match) => (
            <Panel header={`Match pies${match.name}`} key={match.id}>
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

export default History;
