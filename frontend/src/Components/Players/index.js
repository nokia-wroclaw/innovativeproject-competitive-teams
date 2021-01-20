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
import Player from "../Player";

import { AuthContext } from "../Auth/Auth";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title } = Typography;

const Players = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  const [err, setErr] = useState(null);
  const [playersOnPage, setPlayersOnPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allPlayers, setAllPlayers] = useState(0);
  const [searched, setSearched] = useState("");
  const pageSize = 10;

  useEffect(() => {
    Api.get(
      `/players/search/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}`,
      {
        headers: { "firebase-id": fbId, name: searched },
      }
    )
      .then((result) => {
        setPlayersOnPage(result.data);
      })
      .catch((err) => {
        setPlayersOnPage(null);
        setErr(err.toString());
      });
  }, [fbId, currentPage, searched]);

  useEffect(() => {
    setCurrentPage(1);
    Api.get(`/players_count_by_search/`, {
      headers: { "firebase-id": fbId, name: searched },
    })
      .then((result) => {
        setAllPlayers(result.data);
      })
      .catch((err) => {
        setPlayersOnPage(null);
        setErr(err.toString());
      });
  }, [searched, fbId]);

  return playersOnPage ? (
    <Layout className="list-background">
      <Content className="site-layout-background">
        <Card>
          <Title> Players </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search players"
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
              {playersOnPage.map((player) => (
                <Panel header={`Player ${player.name}`} key={player.id}>
                  <Player id={player.id} />
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
              total={allPlayers}
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
