import React, { useContext, useState } from "react";
import {
  Popover,
  Button,
  Col,
  Form,
  Input,
  Space,
  DatePicker,
  AutoComplete,
} from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Notification } from "../Util/Notification";
import { Api } from "../../Api";

const { TextArea } = Input;
const { Option } = AutoComplete;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  // eslint-disable-next-line
  required: "${label} is required!",
};

const MatchCreator = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const [visible, setVisible] = useState(false);
  const [teamNames, setTeamNames] = useState([]);
  const [teamIDs, setTeamIDs] = useState({});

  const onFinish = (values) => {
    const team1name = values.team1id;
    const team2name = values.team2id;
    values.team1id = teamIDs[values.team1id];
    values.team2id = teamIDs[values.team2id];
    console.log(values);
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
        Notification(
          "success",
          "Success.",
          `Match ${values.name} between ${team1name} ${team2name} created successfully.`
        );
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
    Api.get("/teams/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) => {
      console.log(result);
      const tnames = result.data.map((team) => team.name);
      const IDs = result.data.map((team) => team.id);
      const names = {};
      tnames.forEach((key, i) => (names[key] = IDs[i]));
      setTeamNames(tnames);
      setTeamIDs(names);
    });
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
      <Form.Item name="desc" label="Description">
        <TextArea />
      </Form.Item>
      <Form.Item name="starttime" label="Start Time">
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item
        name="team1id"
        label="Team's name"
        rules={[{ required: true }]}
      >
        <AutoComplete onSearch={handleSearch} placeholder="name">
          {teamNames.map((name) => {
            return <Option key={name}>{name}</Option>;
          })}
        </AutoComplete>
      </Form.Item>
      <Form.Item
        name="team2id"
        label="Team's name"
        rules={[{ required: true }]}
      >
        <AutoComplete onSearch={handleSearch} placeholder="name">
          {teamNames.map((name) => {
            return <Option key={name}>{name}</Option>;
          })}
        </AutoComplete>
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
          Create a match
        </Button>
      </Popover>
    </Col>
  );
};

export default MatchCreator;
