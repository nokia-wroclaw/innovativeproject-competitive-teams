import React, { useContext, useEffect, useState } from "react";
import { Typography, Card, Table, Spin, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";
import { AuthContext } from "../Auth/Auth";

import { Api } from "../../Api";

const { Title } = Typography;

const Match = ({ id }) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

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

  return matchdata ? (
    <div className="match-info">
      <Card title={matchdata.name}>
        <Row title="Start Time"> Start Time: {matchdata.start_time}</Row>
        <Row gutter={16}></Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Team 1 ID" bordered={false}>
              {matchdata.team1_id}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Team 2 ID" bordered={false}>
              {matchdata.team2_id}
            </Card>
          </Col>
        </Row>
      </Card>
      ,
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
