import React, { useContext, useEffect, useState } from "react";
import { Typography, Card, Spin, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Api } from "../../Api";
import Team from "../Team";
const { Title } = Typography;

const Match = ({ id }) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser ? currentUser.uid : null;

  // If no id has been passed, check router params
  const { matchid } = useParams();
  if (id === null || id === undefined) id = matchid;

  const [matchdata, setMatchdata] = useState(null);
  const [err, setErr] = useState(null);

  // Get match data
  useEffect(() => {
    if (id === null || id === undefined) setErr("No match id passed.");
    else {
      Api.get("/matches/" + id, { headers: { "firebase-id": fbId } })
        .then((response) => {
          if (response.status === 200) {
            setMatchdata(response.data);
          }
        })
        .catch((err) => {
          setMatchdata(null);
          setErr(err.toString());
        });
    }
  }, [id, fbId]);

  function color(matchd) {
    if (matchd.finished) {
      return "#488c2d";
    }
    return "#8c8c8c";
  }
  return matchdata ? (
    <div className="match-info">
      <Card
        title={
          <Title level={2}>
            {" "}
            <Row>
              <Col align="left" span={8}>
                {matchdata.team1 ? matchdata.team1.name : "TBD"}
              </Col>
              <Col align="center" span={8}>
                vs
              </Col>
              <Col align="right" span={8}>
                {matchdata.team2 ? matchdata.team2.name : "TBD"}
              </Col>
            </Row>
          </Title>
        }
        style={{ borderColor: color(matchdata), borderWidth: 5 }}
      >
        <Row justify="center">
          <Card bordered={false} align="center">
            <Title level={1}>
              {matchdata.score1}:{matchdata.score2}
            </Title>
          </Card>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false}>
              <Team id={matchdata.team1_id} />
            </Card>
          </Col>

          <Col span={12}>
            <Card bordered={false}>
              <Team id={matchdata.team2_id} />
            </Card>
          </Col>
        </Row>
        <Row justify="center">
          <Title level={3}>
            Date: {new Date(Date.parse(matchdata.start_time)).toGMTString()}
          </Title>
        </Row>
      </Card>
    </div>
  ) : err ? (
    <Title>
      Api request failed for match with id: {id}
      <br />
      {err}
    </Title>
  ) : (
    <Spin />
  );
};

export default Match;
