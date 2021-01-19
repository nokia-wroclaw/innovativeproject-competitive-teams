import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { Popover, Button, Col, Form, Input, Space } from "antd";
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

const ResolveTournamentMatch = ({
  tournamentID,
  matchID,
  teamAName,
  teamBName,
}) => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const hdrs = { headers: { "firebase-id": fbId } };
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();

  const onFinish = (values) => {
    Api.patch(
      `/tournaments/${tournamentID}/input_match_result?match_id=${matchID}`,
      {
        score1: values.ascore,
        score2: values.bscore,
      },
      hdrs
    )
      .then(() => Notification("success", "Match resolved successfully"))
      .catch((err) =>
        Notification(
          "error",
          "Eror when resolving match " + matchID,
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    setVisible(false);
    queryClient.refetchQueries(["tournament", tournamentID]);
    queryClient.refetchQueries(["scoreboard", tournamentID]);
    queryClient.refetchQueries(["finished", tournamentID]);
    queryClient.refetchQueries(["unfinished", tournamentID]);
  };

  const teamForm = (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item
        name="ascore"
        label={`${teamAName} score`}
        rules={[{ required: true }]}
      >
        <Input type="number" min={0} step={1} />
      </Form.Item>
      <Form.Item
        name="bscore"
        label={`${teamBName} score`}
        rules={[{ required: true }]}
      >
        <Input type="number" min={0} step={1} />
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
        title="Resolve match"
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
          Resolve
        </Button>
      </Popover>
    </Col>
  );
};

export default ResolveTournamentMatch;
