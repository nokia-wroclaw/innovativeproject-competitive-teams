import React, { useContext, useState } from "react";
import { Popover, Button, Col, Form, Input, Space, AutoComplete } from "antd";
import { useQueryClient } from "react-query";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Notification } from "../Util/Notification";
import { Api } from "../../Api";

const { TextArea } = Input;
const { Option } = AutoComplete;
const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const validateMessages = {
  // eslint-disable-next-line
  required: "${label} is required!",
};

const TeamCreator = () => {
  let { currentUser, userData } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const hdrs = { headers: { "firebase-id": fbId } };
  const [visible, setVisible] = useState(false);
  const [playerIDs, setPlayerIDs] = useState({});
  const [playerQueryIDs, setPlayerQueryIDs] = useState({});
  const queryClient = useQueryClient();

  const onFinish = (values) => {
    // Verify that the player exists
    values.capid = playerQueryIDs[values.capname];
    Api.get("/players/" + values.capid, hdrs)
      // Create the team
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
      // Add the player to the team
      .then((response) => {
        values.teamid = response.data.id;
        return Api.put(
          "/players/" + values.teamid + "?player_id=" + values.capid,
          {},
          hdrs
        );
      })
      // Set the player as team captain
      .then(() =>
        Api.put(
          "/teams/" + values.teamid + "?player_id=" + values.capid,
          {},
          hdrs
        )
      )
      // Handle notifications
      .then(() => {
        Notification(
          "success",
          "Success.",
          "Team " + values.name + " created successfully."
        );
        queryClient.refetchQueries(["capTeams", currentUser, userData]);
        queryClient.refetchQueries(["teams", currentUser, userData]);
      })
      .catch((err) => {
        Notification(
          "error",
          "Eror when creating team " + values.name,
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        );
      });
    setVisible(false);
  };

  const handleSearch = (value) => {
    Api.get("/players/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) => {
      setPlayerIDs(
        result.data.reduce((acc, { id, name }) => {
          acc[name] = id;
          return acc;
        }, {})
      );
      setPlayerQueryIDs({
        ...playerQueryIDs,
        ...result.data.reduce((acc, { id, name }) => {
          acc[name] = id;
          return acc;
        }, {}),
      });
    });
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
      <Form.Item
        name="capname"
        label="Captain name"
        rules={[{ required: true }]}
      >
        <AutoComplete onSearch={handleSearch} placeholder="input here">
          {Object.keys(playerIDs).map((player) => (
            <Option key={player} value={player}>
              {player}
            </Option>
          ))}
        </AutoComplete>
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
          className="TeamCreator"
          onClick={() => {
            setVisible(true);
          }}
        >
          Create a team
        </Button>
      </Popover>
    </Col>
  );
};

export default TeamCreator;
