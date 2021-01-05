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
  Col,
} from "antd";
import "./index.css";

import { Api } from "../../Api";
import { AuthContext } from "../Auth/Auth";
import Tournament, { tournamentTypes } from "../Tournament";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Tournaments = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [err, setErr] = useState(null);
  const [tournamentsOnPage, setTournamentsOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allTournaments, setAllTournaments] = useState(0);
  const [searched, setSearched] = useState("");
  const pageSize = 10;

  useEffect(() => {
    Api.get(
      `/tournaments/search/?skip=${
        (currentPage - 1) * pageSize
      }&limit=${pageSize}`,
      {
        headers: { "firebase-id": fbId, name: searched },
      }
    )
      .then((result) => {
        setTournamentsOnPage(result.data);
        Api.get(`/tournaments_count_by_search/`, {
          headers: { "firebase-id": fbId, name: searched },
        })
          .then((result) => {
            setAllTournaments(result.data);
          })
          .catch((err) => {
            setTournamentsOnPage(null);
            setErr(err.toString());
          });
      })
      .catch((err) => {
        setTournamentsOnPage(null);
        setErr(err.toString());
      });
  }, [fbId, currentPage, searched]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searched]);

  return tournamentsOnPage ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> List of tournaments </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search tournaments"
              onChange={setSearched}
              style={{ width: 200 }}
            />
          </Row>
          <Col span={24}>
            <Collapse>
              {tournamentsOnPage.map((tournament) => (
                <Panel
                  header={`Tournament ${tournament.name} - 
                   ${tournamentTypes[tournament.tournament_type]} `}
                  key={tournament.id}
                >
                  <Tournament data={tournament} />
                </Panel>
              ))}
            </Collapse>
          </Col>
          <Row align="center">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={pageSize}
              onChange={setCurrentPage}
              total={allTournaments}
              current={currentPage}
            />
          </Row>
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
