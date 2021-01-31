import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { Popover, Button, Col, Form, Input, Space, DatePicker } from "antd";
import moment from "moment";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Notification } from "../Util/Notification";
import { Api } from "../../Api";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  // eslint-disable-next-line
  required: "${label} is required!",
};

const ModifyTournamentMatch = ({
  tournamentID,
  matchID,
  name,
  time,
  description,
  score1,
  score2,
}) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser ? currentUser.uid : null;
  const hdrs = { headers: { "firebase-id": fbId } };
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();

  const onFinish = (values) => {
    Api.patch(
      `/matches/${matchID}`,
      {
        name: values.name,
        description: description,
        start_time: values.time,
        finished: false,
        score1: score1,
        score2: score2,
      },
      hdrs
    )
      .then(() => Notification("success", "Match modified successfully"))
      .catch((err) =>
        Notification(
          "error",
          "Eror when modifying tournament " + values.name,
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    setVisible(false);
    queryClient.refetchQueries(["unfinished", tournamentID]);
  };

  const teamForm = (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
      initialValues={{ name: name, time: moment(time) }}
    >
      <Form.Item name="name" label={`Match name`} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="time" label={`Start time`} rules={[{ required: true }]}>
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
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
        placement="top"
        title="Modify match details"
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
          Modify
        </Button>
      </Popover>
    </Col>
  );
};

export default ModifyTournamentMatch;
