import React, { useContext, useState } from "react";
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
  AutoComplete,
} from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Notification } from "../Util/Notification";
import { Api } from "../../Api";

let { Option } = Select;
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
  const [teamIDs, setTeamIDs] = useState({});
  const [currentForm, setCurrentForm] = useState(1);

  const cancel = () => {
    setCurrentForm(1);
    setVisible(false);
  };
  const handleSearch = (value) => {
    Api.get("/teams/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) => {
      setTeamIDs(
        result.data.reduce((acc, { id, name }) => {
          acc[name] = id;
          return acc;
        }, {})
      );
    });
  };

  const onFinish2 = (values) => {
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
        teams_ids: Object.values(teamIDs),
      },
      hdrs
    )

      .then(() => {
        Notification(
          "success",
          "Success.",
          `Tournament ${tourValues.name} created successfully.`
        );
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

  const onFinish = (values) => {
    const helpList = [];
    for (let i = 0; i < values.number_of_teams; i++) {
      helpList.push("team " + i);
    }
    setTeamsFormList(helpList, setTourValues(values));
    setCurrentForm(2);
  };

  return (
    <Col align="center">
      <Popover
        title="Create a new tournament"
        size="large"
        placement="right"
        display="inline-block"
        visible={visible}
        content={
          currentForm === 1 ? (
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
                  <Option value="single-elimination">
                    {" "}
                    single-elimination
                  </Option>
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
          ) : (
            <Form
              {...layout}
              onFinish={onFinish2}
              validateMessages={validateMessages}
            >
              {teamsFormList.map((item, index) => (
                <Form.Item
                  rules={[{ required: true }]}
                  name={`team_${index}`}
                  label={`Team ${index + 1}`}
                >
                  <AutoComplete
                    onSearch={handleSearch}
                    placeholder="input here"
                  >
                    {Object.keys(teamIDs).map((team) => (
                      <Option key={team} value={team}>
                        {team}
                      </Option>
                    ))}
                  </AutoComplete>
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
          )
        }
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
