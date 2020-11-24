import React, { useContext, useEffect, useState } from "react";
import { Typography, Card, Table, Spin } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";

import { AuthContext } from "../Auth/Auth";
import { Api } from "../../Api";
import AddPlayer from "./AddPlayer";

const { Title } = Typography;
const { Column, ColumnGroup } = Table;
const { Meta } = Card;

const Team = ({ id }) => {
  let { currentUser, userData } = useContext(AuthContext);
  let fbId = currentUser.uid;
  console.log(userData);

  // If no id has been passed, check router params
  const { teamid } = useParams();
  if (id === null || id === undefined) id = teamid;

  const [teamdata, setTeamdata] = useState(null);
  const [err, setErr] = useState(null);

  // Get team data
  useEffect(() => {
    if (id === null || id === undefined) setErr("No team id passed.");
    else {
      Api.get("/teams/" + id, { headers: { "firebase-id": fbId } })
        .then((response) => {
          if (response.status === 200) {
            setTeamdata(response.data);
          }
        })
        .catch((err) => {
          setTeamdata(null);
          setErr(err.toString());
        });
    }
  }, [id, fbId]);

  return teamdata ? (
    <div className="team-info">
      <Table
        dataSource={
          teamdata.captain_id
            ? teamdata.players.filter(
                (player) => player.id === teamdata.captain_id
              )
            : null
        }
        size="small"
        pagination={false}
        bordered={true}
      >
        <ColumnGroup title="Captain" align="center">
          <Column title="Player ID" dataIndex="id" key="playerid" />
          <Column title="Name" dataIndex="name" key="playername" />
          <Column
            title="Description"
            dataIndex="description"
            key="playerdesc"
          />
        </ColumnGroup>
      </Table>
      <Table
        dataSource={teamdata.players}
        size="small"
        pagination={false}
        bordered={true}
      >
        <ColumnGroup title="Players" align="center">
          <Column title="Player ID" dataIndex="id" key="playerid" />
          <Column title="Name" dataIndex="name" key="playername" />
          <Column
            title="Description"
            dataIndex="description"
            key="playerdesc"
          />
        </ColumnGroup>
      </Table>
      {userData &&
      (teamdata.captain_id === userData.id ||
        userData.role === "admin" ||
        userData.role === "manager") ? (
        <Card>
          <AddPlayer teamid={id} />
        </Card>
      ) : null}
      <Card>
        <Meta title="Description" description={teamdata.description} />
      </Card>
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

export default Team;
