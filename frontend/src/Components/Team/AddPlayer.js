import React, { useContext, useState } from "react";
import { Popover, notification, Button, Col, Form, Input, Space } from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";

import { Api } from "../../Api";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  // eslint-disable-next-line
  required: "${label} is required!",
};

const openNotificationWithIcon = (type, title, msg) => {
  notification[type]({
    message: title,
    description: msg,
  });
};

const AddPlayer = ({ teamid }) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const hdrs = { headers: { "firebase-id": fbId } };
  const [visible, setVisible] = useState(false);

  const onFinish = (values) => {
    // Verify that the player exists
    Api.get("/players/" + values.playerid, hdrs)
      // Add the player to the team
      .then((response) => {
        values.player = response.data.name;
        return Api.put(
          "/players/" + teamid + "?player_id=" + values.playerid,
          {},
          hdrs
        );
      })
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Success.",
          "Player " + values.player + " has been added to the team."
        );
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Eror when adding player " +
            values.playerid +
            " to team " +
            teamid +
            ".",
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        );
      });
    setVisible(false);
  };

  const playerForm = (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item name="playerid" label="Player ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Space size="middle">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="primary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Col align="center">
      <Popover
        placement="right"
        title="Add a player to the team"
        trigger="click"
        display="inline-block"
        content={playerForm}
        visible={visible}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          Add a player
        </Button>
      </Popover>
    </Col>
  );
};

export default AddPlayer;
