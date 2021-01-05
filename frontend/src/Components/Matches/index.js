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

        console.log(result.data);
      })
      .catch((err) => {
        setMatchesOnPage(null);
        setErr(err.toString());
      });
  }, [fbId, currentPage, searched]);

  const handleChange = (page, pageSize) => {
    setCurrentPage(page);
    console.log(page);
  };

  const handleSearch = (value) => {
    setSearched(value);
  };

  return matchesOnPage ? (
    <Layout style={{ padding: "24px 24px 24px" }}>
      <Content className="site-layout-background">
        <Card>
          <Title> List of matches </Title>
          <Row gutter={[0, 15]}>
            <AutoComplete
              placeholder="Search matches"
              onChange={handleSearch}
              style={{ width: 200 }}
            />
          </Row>

          <Col span={24}>
            <Collapse>
              {matchesOnPage.map((match) => (
                <Panel header={"Match " + match.name} key={match.id}>
                  <Match id={match.id} />
                </Panel>
              ))}
            </Collapse>
          </Col>
          <Row align="center">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={pageSize}
              onChange={handleChange}
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
