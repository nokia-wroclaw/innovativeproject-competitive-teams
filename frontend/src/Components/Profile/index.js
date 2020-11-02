import React, { useEffect, useState } from "react";
import { Typography } from "antd";

const Profile = (props) => {
  const { Title } = Typography;
  const [userid, setUserid] = useState("");

  useEffect(() => {
    setUserid(props.userid);
  }, [props.userid]);

  return <Title>Profile: {userid}</Title>;
};

export default Profile;
