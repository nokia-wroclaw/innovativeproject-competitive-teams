import React, { useEffect, useState, useContext } from "react";
import { Typography, Divider, Button, List, Table, Space, Spin } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";

import { Api } from "../../Api";
import { AuthContext } from "../Auth/Auth";
import SEGraph from "./SEGraph";
import ResolveTournamentMatch from "./ResolveTournamentMatch";

const { Title } = Typography;
const { Column, ColumnGroup } = Table;

export const tournamentTypes = {
  "round-robin": "Round Robin",
  "single-elimination": "Single Elimination",
  swiss: "Swiss",
};

const Tournament = ({ id, data }) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;

  // If no id has been passed, check router params
  const { tournamentid } = useParams();
  if (id === null || id === undefined) id = tournamentid;

  const [tournamentData, setTournamentData] = useState(null);
  const [scoreboard, setScoreboard] = useState(null);
  const [finishedMatches, setFinishedMatches] = useState(null);
  const [unfinishedMatches, setUnfinishedMatches] = useState(null);
  const [err, setErr] = useState(null);

  // Get tournament data
  useEffect(() => {
    if (data) {
      setTournamentData(data);
    } else if (id) {
      Api.get("/tournaments/" + id, { headers: { "firebase-id": fbId } })
        .then((response) => {
          if (response.status === 200) {
            setTournamentData(response.data);
          }
        })
        .catch((err) => {
          setTournamentData(null);
          setErr(err.toString());
        });
    } else {
      setErr("No tournament id/data passed.");
    }
  }, [id, fbId, data]);

  // Get scoreboard, match lists
  useEffect(() => {
    if (tournamentData) {
      Api.get("/tournament/" + tournamentData.id + "/scoreboard", {
        headers: { "firebase-id": fbId },
      })
        .then((response) => {
          if (response.status === 200) {
            setScoreboard(response.data);
          }
        })
        .catch((err) => {
          setScoreboard(null);
          setErr(err.toString());
        });

      Api.get("/tournament/" + tournamentData.id + "/finished_matches", {
        headers: { "firebase-id": fbId },
      })
        .then((response) => {
          if (response.status === 200) {
            setFinishedMatches(response.data);
          }
        })
        .catch((err) => {
          setFinishedMatches(null);
          setErr(err.toString());
        });

      Api.get("/tournament/" + tournamentData.id + "/unfinished_matches", {
        headers: { "firebase-id": fbId },
      })
        .then((response) => {
          if (response.status === 200) {
            setUnfinishedMatches(response.data);
          }
        })
        .catch((err) => {
          setUnfinishedMatches(null);
          setErr(err.toString());
        });
    }
  }, [fbId, id, tournamentData]);

  return tournamentData &&
    scoreboard &&
    finishedMatches &&
    unfinishedMatches ? (
    <div
      style={{ overflow: "auto" }}
      className={scoreboard.finished ? "bgFinished" : null}
    >
      {tournamentData.tournament_type === "single-elimination" ? (
        <SEGraph id={id} maches={[]} />
      ) : null}
      <List
        header={
          <div>
            <strong>{tournamentData.name}</strong>
          </div>
        }
        bordered
        dataSource={[
          {
            title: "Type",
            desc: tournamentTypes[tournamentData.tournament_type],
          },
          { title: "Number of teams", desc: tournamentData.teams.length },
          {
            title: "Description",
            desc: tournamentData.description
              ? tournamentData.description
              : "Empty",
          },
          {
            title: "Status",
            desc: scoreboard.finished
              ? `Finshed. Winner: ${scoreboard.results[0].team.name}!`
              : "In progress.",
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.desc} />
          </List.Item>
        )}
      />
      <Divider />
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
          <Column title="Match points" dataIndex="match_points" key="mpoints" />
          <Column
            title="Tournament points"
            dataIndex="tournament_points"
            key="tpoints"
          />
        </ColumnGroup>
      </Table>
      <Divider />
      <Table
        dataSource={finishedMatches.map((match) => ({
          name: match.name,
          teama: match.team1.name,
          teamb: match.team2.name,
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
      <Divider />
      <Table
        dataSource={unfinishedMatches.map((match) => ({
          id: match.id,
          name: match.name,
          time: new Date(Date.parse(match.start_time)).toGMTString(),
          teama: match.team1.name,
          teamb: match.team2.name,
          score: `${match.score1} : ${match.score2}`,
        }))}
        size="small"
        pagination={false}
        bordered={true}
      >
        <ColumnGroup title="Unfinished matches" align="center">
          <Column title="Match" dataIndex="name" key="matchname" />
          <Column title="Start time" dataIndex="time" key="time" />
          <Column title="Team A" dataIndex="teama" key="teama" />
          <Column title="Team B" dataIndex="teamb" key="teamb" />
          <Column title="Score (A : B)" dataIndex="score" key="score" />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <Space size="small">
                <Button type="primary">Modify</Button>
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
