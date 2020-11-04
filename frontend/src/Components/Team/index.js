import React, { useEffect, useState } from "react";
import { Typography, Card, Table } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";

import { Api } from "../../Api";

const Team = (props) => {
  const { Title } = Typography;
  const { teamid } = useParams();
  const [teamdata, setTeamdata] = useState(null);
  const [render, setRender] = useState(<Title>Team: {teamid}</Title>);
  const { Column, ColumnGroup } = Table;
  const { Meta } = Card;

  // Get team data
  useEffect(() => {
    if (props.teamdata) setTeamdata(props.teamdata);
    else if (teamid) {
      Api.get("/teams/" + teamid)
        .then((response) => {
          if (response.status === 200) {
            setTeamdata(response.data);
          }
        })
        .catch((err) => {
          setRender(
            <Title>
              Api request failed for team with id: {teamid}
              <br />
              {err.toString()}
            </Title>
          );
        });
    } else {
      return <Title> No team id/data! </Title>;
    }
  }, [props.teamdata, teamid]);

  // Parse team data
  useEffect(() => {
    console.log(teamdata);
    if (teamdata) {
      setRender(
        <div className="team-info">
          <Table
            dataSource={
              teamdata.captain_id ? [{ captain_id: teamdata.captain_id }] : null
            }
            size="small"
            pagination={false}
            bordered={true}
          >
            <ColumnGroup title="Captain" align="center">
              <Column title="Player ID" dataIndex="captain_id" key="playerid" />
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

          <Card>
            <Meta title="Description" description={teamdata.description} />
          </Card>
        </div>
      );
    }
  }, [teamdata, props.arrow]);

  return render;
};

export default Team;
