import React, { useContext } from "react";
import { notification, Button, Col } from "antd";
import { useQueryClient } from "react-query";
import "./index.css";
import { AuthContext } from "../Auth/Auth";

import { Api } from "../../Api";

const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg,
  });
};

const MakeCaptain = ({ teamid, playerid }) => {
  let { currentUser, userData } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const hdrs = { headers: { "firebase-id": fbId } };
  const queryClient = useQueryClient();

  const handleClick = () => {
    Api.put("/teams/" + teamid + "?player_id=" + playerid, {}, hdrs)
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Success.",
          "Team captain updated."
        );
        queryClient.refetchQueries(["team", teamid]);
        queryClient.refetchQueries(["teams", currentUser, userData]);
        queryClient.refetchQueries(["capTeams", currentUser, userData]);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Error when setting team " + teamid + " captain " + playerid + ".",
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        );
      });
  };

  return (
    <Col align="center">
      <Button type="primary" onClick={handleClick}>
        Make captain
      </Button>
    </Col>
  );
};

export default MakeCaptain;
