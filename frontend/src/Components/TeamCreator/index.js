import React, { useContext, useState } from "react";
import { Popover, notification, Button, Col, Form, Input, Space } from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";

import { Api } from "../../Api";

const { TextArea } = Input;

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

const TeamCreator = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const hdrs = { headers: { "firebase-id": fbId } };
  const [visible, setVisible] = useState(false);

  const onFinish = (values) => {
    // Verify that the player exists
    Api.get("/players/" + values.capid, hdrs)
      .then(() =>
        Api.post(
          "/teams/",
          {
            name: values.name,
            description: values.desc,
            color: "ffffff",
          },
          hdrs
        )
      )
      // Create the team
      .then((response) => {
        values.teamid = response.data.id;
        return Api.put(
          "/players/" + values.teamid + "?player_id=" + values.capid,
          {},
          hdrs
        );
      })
      // Add the player to the team
      .then(() =>
        Api.put(
          "/teams/" + values.teamid + "?player_id=" + values.capid,
          {},
          hdrs
        )
      )
      // Set the player as team captain
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Success.",
          "Team " + values.name + " created successfully."
        );
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Eror when creating team " + values.name,
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        );
      });
    setVisible(false);
  };

  const teamForm = (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="capid" label="Captain ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="desc" label="Description">
        <TextArea />
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
        title="Create a new team"
        trigger="click"
        display="inline-block"
        content={teamForm}
        visible={visible}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          {" "}
          Create a team{" "}
        </Button>
      </Popover>
    </Col>
  );
};

export default TeamCreator;
