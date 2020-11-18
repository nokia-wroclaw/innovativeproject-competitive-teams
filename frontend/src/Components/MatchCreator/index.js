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

const MatchCreator = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const [visible, setVisible] = useState(false);

  const onFinish = (values) => {
    const hdrs = {
      headers: {
        "firebase-id": fbId,
        "team1-id": values.team1id,
        "team2-id": values.team2id,
      },
    };

    Api.post(
      "/matches/",
      {
        name: values.name,
        description: values.desc,
        color: "ffffff",
        start_time: values.starttime,
        finished: false,
        score1: 0,
        score2: 0,
      },
      hdrs
    )

      .then(() => {
        openNotificationWithIcon(
          "success",
          "Success.",
          "Match " +
            values.name +
            " between " +
            values.team1id +
            values.team2id +
            " created successfully."
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

  const matchForm = (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="creatorid"
        label="Creator ID"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="desc" label="Description">
        <TextArea />
      </Form.Item>
      <Form.Item name="starttime" label="Start time">
        <Input />
      </Form.Item>
      <Form.Item name="team1id" label="Team 1 ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="team2id" label="Team 2 ID" rules={[{ required: true }]}>
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
        title="Create a new match"
        trigger="click"
        display="inline-block"
        content={matchForm}
        visible={visible}
      >
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          {" "}
          Create a match{" "}
        </Button>
      </Popover>
    </Col>
  );
};

export default MatchCreator;
