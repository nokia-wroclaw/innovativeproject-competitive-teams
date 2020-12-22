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
  const [playersOnPage, setPlayersOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    Api.get("/players/", { headers: { "firebase-id": fbId } })
      .then((result) => {
        setPlayersOnPage(result.data.slice(0, 10));
        setPlayers(result.data);
      })
      .catch((err) => {
        setPlayers(null);
        setErr(err.toString());
      });
  }, [fbId]);

  const handleSearch = (value) => {
    Api.get("/players/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) => {
      setPlayers(result.data);
      let itemsIgnored = (currentPage - 1) * pageSize;
      setPlayersOnPage(
        result.data.slice(itemsIgnored, itemsIgnored + pageSize)
      );
    });
  };

  const handleChange = (page, pageSize) => {
    setCurrentPage(page);
    let itemsIgnored = (page - 1) * pageSize;
    setPlayersOnPage(players.slice(itemsIgnored, itemsIgnored + pageSize));
  };

  return players ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> List of players </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search players"
              onChange={handleSearch}
              style={{ width: 200 }}
            />
          </Row>
          <Col span={24}>
            <Collapse>
              {playersOnPage.map((player) => (
                <Panel header={"Player " + player.name} key={player.id}>
                  <Player id={player.id} />
                </Panel>
              ))}
            </Collapse>
          </Col>
          <Row align="center">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={pageSize}
              onChange={handleChange}
              total={players.length}
            />
          </Row>
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
