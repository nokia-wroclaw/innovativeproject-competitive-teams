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

  const [tournaments, setTournaments] = useState(null);
  const [err, setErr] = useState(null);
  const [tournamentsOnPage, setTournamentsOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    Api.get("/tournaments/", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setTournamentsOnPage(result.data.slice(0, 10));
        setTournaments(result.data);
      })
      .catch((err) => {
        setTournaments(null);
        setErr(err.toString());
      });
  }, [fbId]);

  const handleSearch = (value) => {
    Api.get("/tournaments/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) => {
      setTournaments(result.data);
      let itemsIgnored = (currentPage - 1) * pageSize;
      setTournamentsOnPage(
        result.data.slice(itemsIgnored, itemsIgnored + pageSize)
      );
    });
  };

  const handleChange = (page, pageSize) => {
    setCurrentPage(page);
    let itemsIgnored = (page - 1) * pageSize;
    setTournamentsOnPage(
      tournaments.slice(itemsIgnored, itemsIgnored + pageSize)
    );
  };

  return tournaments ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> List of tournaments </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search tournaments"
              onChange={handleSearch}
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
              onChange={handleChange}
              total={tournaments.length}
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
