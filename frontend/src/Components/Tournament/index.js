import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Typography, Divider, Table, Space, Spin, Card, Row, Col } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";

import { Api } from "../../Api";
import { AuthContext } from "../Auth/Auth";
import SEGraph from "./SEGraph";
import ResolveTournamentMatch from "./ResolveTournamentMatch";
import ModifyTournamentMatch from "./ModifyTournamentMatch";

const { Title } = Typography;
const { Column, ColumnGroup } = Table;

export const tournamentTypes = {
  "round-robin": "Round Robin",
  "single-elimination": "Single Elimination",
  swiss: "Swiss",
};

const Tournament = ({ id }) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  // If no id has been passed, check router params
  const { tournamentid } = useParams();
  if (id === null || id === undefined) id = tournamentid;

  const { isLoading, error: err, data: tournamentData } = useQuery(
    ["tournament", id],
    async () => {
      const res = await Api.get("/tournaments/" + id, {
        headers: { "firebase-id": fbId },
      });
      return res.data;
    }
  );

  const { data: scoreboard } = useQuery(
    ["scoreboard", id],
    async () => {
      const res = await Api.get(
        "/tournament/" + tournamentData.id + "/scoreboard",
        {
          headers: { "firebase-id": fbId },
        }
      );
      return res.data;
    },
    {
      enabled: !!tournamentData,
    }
  );

  const { data: finishedMatches } = useQuery(
    ["finished", id],
    async () => {
      const res = await Api.get(
        "/tournament/" + tournamentData.id + "/finished_matches",
        {
          headers: { "firebase-id": fbId },
        }
      );
      return res.data;
    },
    {
      enabled: !!tournamentData,
    }
  );

  const { data: unfinishedMatches } = useQuery(
    ["unfinished", id],
    async () => {
      const res = await Api.get(
        "/tournament/" + tournamentData.id + "/unfinished_matches",
        {
          headers: { "firebase-id": fbId },
        },
        {
          enabled: !!tournamentData,
        }
      );
      return res.data;
    },
    {
      enabled: !!tournamentData,
    }
  );

  return tournamentData ? (
    <div
      style={{ overflow: "auto" }}
      className={scoreboard && scoreboard.finished ? "bgFinished" : null}
    >
      <Card title={<strong>{tournamentData.name}</strong>}>
        <Row gutter={16}>
          <Col span={6}>
            <Card title="Type" type="inner">
              {tournamentTypes[tournamentData.tournament_type]}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Number of teams" type="inner">
              {tournamentData.teams.length}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Description" type="inner">
              {tournamentData.description
                ? tournamentData.description
                : "Empty"}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Status" type="inner">
              {scoreboard && scoreboard.finished
                ? `Finshed. Winner: ${scoreboard.results[0].team.name}!`
                : "In progress."}
            </Card>
          </Col>
        </Row>
      </Card>
      {tournamentData.tournament_type === "single-elimination" ? (
        isLoading ? (
          <Spin />
        ) : (
          <SEGraph tournamentData={tournamentData} />
        )
      ) : null}
      {scoreboard ? (
        <Table
          dataSource={scoreboard.results.map((team, idx) => ({
            idx: (idx + 1).toString() + ".",
            name: team.team.name,
            id: team.team.id,
            match_points: team.match_points,
            tournament_points: team.tournament_points,
          }))}
          size="small"
          pagination={false}
          bordered={true}
        >
          <ColumnGroup title="Scoreboard" align="center">
            <Column title="Position" dataIndex="idx" key="position" />
            <Column title="Team" dataIndex="name" key="teamname" />
            <Column title="Team id" dataIndex="id" key="teamid" />
            <Column
              title="Match points"
              dataIndex="match_points"
              key="mpoints"
            />
            <Column
              title="Tournament points"
              dataIndex="tournament_points"
              key="tpoints"
            />
          </ColumnGroup>
        </Table>
      ) : null}
      <Divider />
      {finishedMatches && finishedMatches.length > 0 ? (
        <Table
          dataSource={finishedMatches.map((match) => ({
            name: match.name,
            teama: match.team1 === null ? "TBD" : match.team1.name,
            teamb: match.team2 === null ? "TBD" : match.team2.name,
            score: `${match.score1} : ${match.score2}`,
          }))}
          size="small"
          pagination={false}
          bordered={true}
        >
          <ColumnGroup title="Finished matches" align="center">
            <Column title="Match" dataIndex="name" key="matchname" />
            <Column title="Team A" dataIndex="teama" key="teama" />
            <Column title="Team B" dataIndex="teamb" key="teamb" />
            <Column title="Score (A : B)" dataIndex="score" key="score" />
          </ColumnGroup>
        </Table>
      ) : null}
      <Divider />
      {unfinishedMatches && unfinishedMatches.length > 0 ? (
        <Table
          dataSource={unfinishedMatches.map((match) => ({
            id: match.id,
            name: match.name,
            time: new Date(Date.parse(match.start_time)).toGMTString(),
            desc: match.description,
            teama: match.team1 === null ? "TBD" : match.team1.name,
            teamb: match.team2 === null ? "TBD" : match.team2.name,
            score1: match.score1,
            score2: match.score2,
            score: `${match.score1} : ${match.score2}`,
          }))}
          size="small"
          pagination={false}
          bordered={true}
        >
          <ColumnGroup title="Unfinished matches" align="center">
            <Column title="Match" dataIndex="name" key="matchname" />
            <Column title="Date" dataIndex="time" key="time" />
            <Column title="Team A" dataIndex="teama" key="teama" />
            <Column title="Team B" dataIndex="teamb" key="teamb" />
            <Column title="Score (A : B)" dataIndex="score" key="score" />
            <Column
              title="Actions"
              key="actions"
              render={(text, record) => (
                <Space size="small">
                  <ModifyTournamentMatch
                    tournamentID={tournamentData.id}
                    matchID={record.id}
                    name={record.name}
                    time={record.time}
                    description={record.description}
                    score1={record.score1}
                    score2={record.score2}
                  />
                  <ResolveTournamentMatch
                    tournamentID={tournamentData.id}
                    matchID={record.id}
                    teamAName={record.teama}
                    teamBName={record.teamb}
                  />
                </Space>
              )}
            />
          </ColumnGroup>
        </Table>
      ) : null}
    </div>
  ) : err ? (
    <Title>
      Api request failed for team with id: {id}
      <br />
      {err}
    </Title>
  ) : (
    <Spin />
  );
};

export default Tournament;
