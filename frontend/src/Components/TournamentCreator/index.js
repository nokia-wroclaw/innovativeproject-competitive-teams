import React, { useContext, useState } from "react";
import {
  Popover,
  Button,
  Col,
  Form,
  Input,
  Space,
  DatePicker,
  Steps,
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
  let teams_form_list = [];
  let teams_ids_list = [];
  let firstformdone = false;
  const add_team = (value) => {
    teams_ids_list.push(value);
    console.log(teams_ids_list);
  };
  const onFinish = (values) => {
    firstformdone = true;
    for (let i = 0; i < values.number_of_teams; i++) {
      teams_form_list.push("team" + `${i}`);
    }
    const hdrs = {
      headers: {
        "firebase-id": fbId,
      },
    };

    Api.post(
      "/tournamentes/",
      {
        name: values.name,
        description: values.desc,
        color: "ffffff",
        tournament_type: values.tournament_type,
        start_time: values.starttime,
        teams_ids: teams_ids_list,
      },
      hdrs
    )

      .then(() => {
        Notification(
          "success",
          "Success.",
          "Tournament " + " created successfully."
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

  const tournamentForm1 = (
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

  const tournamentForm2 = (
    <Form>
      {teams_form_list.map((item, index) => {
        return <Input placeholder={item} onPressEnter={add_team}></Input>;
      })}
    </Form>
  );

  if (!firstformdone) {
    return (
      <Col align="center">
        <Popover
          placement="right"
          title="Create a new tournament"
          trigger="click"
          display="inline-block"
          content={tournamentForm1}
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
  } else {
    return (
      <Col align="center">
        <Popover
          placement="right"
          title="Create a new tournament"
          trigger="click"
          display="inline-block"
          content={tournamentForm2}
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
  }
};
export default TournamentCreator;
