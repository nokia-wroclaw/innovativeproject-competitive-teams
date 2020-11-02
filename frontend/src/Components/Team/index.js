import React from "react";
import { Typography } from "antd";
import { useParams } from "react-router-dom";

const Team = () => {
  const { Title } = Typography;
  const { teamid } = useParams();

  return <Title>Team: {teamid}</Title>;
};

export default Team;
