import React from "react";
import { Typography } from "antd";

const { Title } = Typography;
const Profile = ({ userid }) => {
  return <Title>Profile: {userid}</Title>;
};

export default Profile;
