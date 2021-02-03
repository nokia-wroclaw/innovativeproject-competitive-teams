import React, { useContext, useEffect, useState } from "react";
import { Typography, Card, Spin, Select } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";
import { AuthContext } from "../Auth/Auth";

import { Api } from "../../Api";
import { PassThrough } from "stream";
import { Notification } from "../Util/Notification";

const { Title, Text } = Typography;
const { Option } = Select;
const Player = ({ id }) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser ? currentUser.uid : null;

  // If no id has been passed, check router params
  const { playerid } = useParams();
  if (id === null || id === undefined) id = playerid;

  const [playerdata, setPlayerdata] = useState(null);
  const [err, setErr] = useState(null);

  // Get player data
  useEffect(() => {
    if (id === null || id === undefined) setErr("No player id passed.");
    else {
      Api.get("/players/" + id, { headers: { "firebase-id": fbId } })
        .then((response) => {
          if (response.status === 200) {
            setPlayerdata(response.data);
          }
        })
        .catch((err) => {
          setPlayerdata(null);
          setErr(err.toString());
        });
    }
  }, [id, fbId]);

  const updateRole = (value) => {
    console.log(playerdata.id, value);
    Api.patch(
      `/change_role/${playerdata.id}`,
      {},
      {
        headers: { "player-role": value, "firebase-id": fbId },
      }
    )
      .then((response) => {
        Notification(
          "success",
          "Success.",
          `Players role updated successfully`
        );
      })
      .catch((err) => {
        Notification(
          "error",
          "Eror when updating role",
          "you are not an admin"
        );
      });
  };
  return playerdata ? (
    <div className="player-info">
      <Card title="Player INFO: ">
        <p>
          <Text strong>Name: </Text> {playerdata.name}
        </p>
        <p>
          <Text strong>Description: </Text> {playerdata.description}
        </p>
        <p>
          <Text strong>Colour: </Text> {playerdata.colour}
        </p>
        <p>
          <Text strong>ID: </Text> {playerdata.id}
        </p>
        <p>
          <Text strong>Role: </Text>
          <Select
            defaultValue={playerdata.role}
            style={{ width: 120 }}
            onChange={updateRole}
          >
            <Option value="admin">admin</Option>
            <Option value="moderator">moderator</Option>
            <Option value="player">player</Option>
          </Select>
        </p>
      </Card>
    </div>
  ) : err ? (
    <Title>
      Api request failed for player with id: {id}
      <br />
      {err}
    </Title>
  ) : (
    <Spin />
  );
};

export default Player;
