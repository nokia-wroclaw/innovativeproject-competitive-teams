import React, { useEffect, useState } from "react";
import { Typography } from "antd";

const Profile = (props) => {
  const { Title } = Typography;
  const [userid, setUserid] = useState("");

  useEffect(() => {
    setUserid(props.userid);
  }, [props.userid]);

  console.log(props);
  console.log(props.userid);

  return <Title>Profile: {userid}</Title>;
};

export default Profile;
