import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Typography, Card, Table, Spin, Space } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";

import { AuthContext } from "../Auth/Auth";
import { Api } from "../../Api";
import AddPlayer from "./AddPlayer";
import RemovePlayer from "./RemovePlayer";
import MakeCaptain from "./MakeCaptain";

const { Title } = Typography;
const { Column, ColumnGroup } = Table;
const { Meta } = Card;

const Team = ({ id }) => {
  let { currentUser, userData } = useContext(AuthContext);
  let fbId = currentUser ? currentUser.uid : null;

  // If no id has been passed, check router params
  const { teamid } = useParams();
  if (id === null || id === undefined) id = teamid;

  const { isIdle, error: err, data: teamData } = useQuery(
    ["team", id],
    async () => {
      const res = await Api.get("/teams/" + id, {
        headers: { "firebase-id": fbId },
      });
      return res.data;
    },
    {
      enabled: !!id,
    }
  );

  return teamData ? (
    <div className="team-info">
      <Table
        dataSource={
          teamData.captain_id
            ? teamData.players.filter(
                (player) => player.id === teamData.captain_id
              )
            : null
        }
        size="small"
        pagination={false}
        bordered={true}
      >
        <ColumnGroup title="Captain" align="center">
          <Column title="Name" dataIndex="name" key="playername" />
          <Column
            title="Description"
            dataIndex="description"
            key="playerdesc"
          />
        </ColumnGroup>
      </Table>
      <Table
        dataSource={teamData.players}
        size="small"
        pagination={false}
        bordered={true}
      >
        <ColumnGroup title="Players" align="center">
          <Column title="Name" dataIndex="name" key="playername" />
          <Column
            title="Description"
            dataIndex="description"
            key="playerdesc"
          />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) =>
              userData &&
              (teamData.captain_id === userData.id ||
                userData.role === "admin" ||
                userData.role === "manager") ? (
                <Space size="small">
                  {record.id === teamData.captain_id ? null : (
                    <MakeCaptain teamid={id} playerid={record.id} />
                  )}
                  <RemovePlayer teamid={id} playerid={record.id} />
                </Space>
              ) : null
            }
          />
        </ColumnGroup>
      </Table>
      {userData &&
      (teamData.captain_id === userData.id ||
        userData.role === "admin" ||
        userData.role === "manager") ? (
        <Card>
          <AddPlayer teamid={id} />
        </Card>
      ) : null}
      <Card>
        <Meta title="Description" description={teamData.description} />
      </Card>
    </div>
  ) : err ? (
    <Title>
      Api request failed for team with id: {id}
      <br />
      {err}
    </Title>
  ) : isIdle ? (
    <Card>
      <Table></Table>
    </Card>
  ) : (
    <Spin />
  );
};

export default Team;
