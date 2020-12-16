import React, { useContext, useEffect, useState } from "react";
import {
  Popover,
  Button,
  Col,
  Form,
  Input,
  Space,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Notification } from "../Util/Notification";
import { Api } from "../../Api";

const { Option } = Select;
const layout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  // eslint-disable-next-line
  required: "${label} is required!",
};

const TournamentCreator = () => {
  const { currentUser } = useContext(AuthContext);
  const fbId = currentUser.uid;
  const [visible, setVisible] = useState(false);
  const [teamsFormList, setTeamsFormList] = useState(null);
  const [tourValues, setTourValues] = useState({});
  const teams_ids_list = [];
  const addTeam = (value) => {
    teams_ids_list.push(value);
  };

  const cancel = () => {
    setVisible(false);
    settourForm(tournamentForm);
  };
  const onFinish2 = (values) => {
    Object.keys(values)
      .filter((prop) => prop.slice(0, 5) === "team_")
      .forEach((team) => addTeam(values[team]));

    const hdrs = {
      headers: {
        "firebase-id": fbId,
      },
    };
    Api.post(
      "/tournaments/",
      {
        name: tourValues.name,
        description: tourValues.desc,
        color: "ffffff",
        tournament_type: tourValues.tournament_type,
        start_time: tourValues.starttime,
        teams_ids: teams_ids_list,
      },
      hdrs
    )

      .then(() => {
        Notification("success", "Success.", "Tournament created successfully.");
      })
      .catch((err) => {
        Notification(
          "error",
          `Eror when creating tournament  + ${
            (values.name,
            err.response && err.response.data.detail
              ? err.response.data.detail
              : err.message)
          }`
        );
      });
    setVisible(false);
  };
  useEffect(() => {
    if (teamsFormList) {
      settourForm(
        <Form
          {...layout}
          onFinish={onFinish2}
          validateMessages={validateMessages}
        >
          {teamsFormList.map((item, index) => (
            <Form.Item
              rules={[{ required: true }]}
              name={`team_${index}`}
              label={`Team ${index + 1} id`}
            >
              <InputNumber />
            </Form.Item>
          ))}

          <Form.Item>
            <Space size="middle">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button type="primary" onClick={cancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      );
    }
    // eslint-disable-next-line
  }, [teamsFormList]);

  const onFinish = (values) => {
    const helpList = [];
    for (let i = 0; i < values.number_of_teams; i++) {
      helpList.push("team " + i);
    }
    setTourValues(values);
    setTeamsFormList(helpList);
  };

  const tournamentForm = (
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
        <Input />
      </Form.Item>
      <Form.Item name="starttime" label="Start Time">
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item
        name="tournament_type"
        label="Type:"
        rules={[{ required: true }]}
      >
        <Select>
          <Option value="round-robin">round-robin</Option>
          <Option value="swiss">swiss</Option>
          <Option value="single-elimination"> single-elimination</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="number_of_teams"
        label="Number of teams: "
        rules={[{ required: true }]}
      >
        <InputNumber />
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
  const [tourForm, settourForm] = useState(tournamentForm);
  return (
    <Col align="center">
      <Popover
        placement="right"
        title="Create a new tournament"
        trigger="click"
        display="inline-block"
        content={tourForm}
        visible={visible}
        size="large"
      >
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          Create a tournament
        </Button>
      </Popover>
    </Col>
  );
};
export default TournamentCreator;
