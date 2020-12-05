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
} from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { Notification } from "../Util/Notification";
import { Api } from "../../Api";

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  // eslint-disable-next-line
  required: "${label} is required!",
};

const TournamentCreator = () => {
  let { currentUser } = useContext(AuthContext);
  let fbId = currentUser.uid;
  const [visible, setVisible] = useState(false);
  const [teams_form_list, setTeams_form_list] = useState(null);
  const [tour_values, setTour_values] = useState({});
  let teams_ids_list = [];
  const add_team = (value) => {
    teams_ids_list.push(value);
  };

  const onFinish2 = (values) => {
    for (let prop in values) {
      if (Object.prototype.hasOwnProperty.call(values, prop)) {
        if (prop.slice(0, 5) == "team_") {
          add_team(values[prop]);
        }
      }
    }
    console.log(tour_values);
    console.log(teams_ids_list);
    const hdrs = {
      headers: {
        "firebase-id": fbId,
      },
    };
    Api.post(
      "/tournaments/",
      {
        name: tour_values.name,
        description: tour_values.desc,
        color: "ffffff",
        tournament_type: tour_values.tournament_type,
        start_time: tour_values.starttime,
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
          "Eror when creating tournament " + values.name,
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        );
      });
    setVisible(false);
  };
  useEffect(() => {
    if (teams_form_list) {
      settourForm(
        <Form
          {...layout}
          size="large"
          onFinish={onFinish2}
          validateMessages={validateMessages}
        >
          {teams_form_list.map((item, index) => {
            return (
              <Form.Item
                name={"team_" + index}
                label={"Team " + (index + 1) + " id"}
              >
                <InputNumber />
              </Form.Item>
            );
          })}
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
    }
  }, [teams_form_list]);

  const onFinish = (values) => {
    let help_list = [];
    for (let i = 0; i < values.number_of_teams; i++) {
      help_list.push("team " + i);
    }
    setTour_values(values);
    setTeams_form_list(help_list);
  };

  const tournamentForm = (
    <Form
      {...layout}
      name="nest-messages"
      size="large"
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
      <Form.Item name="tournament_type" label="Type of tournament:">
        <Input />
      </Form.Item>
      <Form.Item name="number_of_teams" label="Number of teams:">
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
