import React from "react";
import { Typography } from "antd";
import { AuthContext } from "../Auth/Auth";

const { Title } = Typography;
const Profile = ({ userid }) => {
  console.log(React.useContext(AuthContext)["username"]);
  console.log(React.useContext(AuthContext)["colour"]);
  console.log(React.useContext(AuthContext)["rank"]);
  console.log(React.useContext(AuthContext)["description"]);
  return <Title>Profile: {userid}</Title>;
};

export default Profile;
