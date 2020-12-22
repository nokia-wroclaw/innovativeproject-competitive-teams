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
const CreateTeams = ({
  fbId,
  cancel,
  onFinish,
  teamsNumber,
  updateTeamIDs,
  isSwiss,
}) => {
  const [nameToId, setNameToId] = useState({});
  const handleSearch = (value) => {
    Api.get("/teams/search/", {
      headers: {
        "firebase-id": fbId,
        name: value,
      },
    }).then((result) =>
      setNameToId(
        result.data.reduce((acc, { id, name }) => {
          acc[name] = id;
          return acc;
        }, {})
      )
    );
  };
  return (
    <Form {...layout} onFinish={onFinish} validateMessages={validateMessages}>
      {isSwiss && (
        <Form.Item name="swiss_rounds" label="Rounds:">
          <InputNumber />
        </Form.Item>
      )}
      {[...Array(teamsNumber)].map((_, index) => (
        <Form.Item
          key={index}
          rules={[{ required: true }]}
          name={`team_${index}`}
          label={`Team ${index + 1}`}
        >
          <AutoComplete
            onSearch={handleSearch}
            placeholder="input here"
            onSelect={(value) => updateTeamIDs(nameToId[value])}
          >
            {Object.keys(nameToId).map((team) => (
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
  );
};
const CreateTournament = ({ cancel, onFinish }) => (
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
        <Button type="primary" onClick={cancel}>
          Cancel
        </Button>
      </Space>
    </Form.Item>
  </Form>
);
const TournamentCreator = () => {
  const { currentUser } = useContext(AuthContext);
  const fbId = currentUser.uid;
  const [visible, setVisible] = useState(false);
  const [teamIDs, setTeamIDs] = useState([]);
  const [tournamentInfo, setTournamentInfo] = useState({});
  const [currentForm, setCurrentForm] = useState(1);
  const [isSwiss, setIsSwiss] = useState(false);
  const cancel = () => {
    setCurrentForm(1);
    setVisible(false);
    setIsSwiss(false);
  };
  const onFinishTournamentForm = (values) => {
    setTournamentInfo(values);
    setCurrentForm(2);
    setIsSwiss(values.tournament_type === "swiss");
  };
  const onFinishTeamsForm = (values) => {
    setIsSwiss(false);
    Api.post(
      "/tournaments/",
      {
        name: tournamentInfo.name,
        description: tournamentInfo.desc,
        color: "ffffff",
        tournament_type: tournamentInfo.tournament_type,
        start_time: tournamentInfo.starttime,
        teams_ids: teamIDs,
        swiss_rounds: values.swiss_rounds,
      },
      {
        headers: {
          "firebase-id": fbId,
        },
      }
    )
      .then(() => {
        setTeamIDs([]);
        Notification(
          "success",
          "Success.",
          `Tournament ${tournamentInfo.name} created successfully.`
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
    setCurrentForm(1);
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
            <CreateTournament
              cancel={cancel}
              onFinish={onFinishTournamentForm}
            />
          ) : (
            <CreateTeams
              cancel={cancel}
              onFinish={onFinishTeamsForm}
              teamsNumber={tournamentInfo.number_of_teams}
              updateTeamIDs={(newTeamID) =>
                setTeamIDs((prevTeamIDs) => [...prevTeamIDs, newTeamID])
              }
              fbId={fbId}
              isSwiss={isSwiss}
            />
          )
        }
      >
        <Button type="primary" onClick={() => setVisible(true)}>
          Create a tournament
        </Button>
      </Popover>
    </Col>
  );
};
export default TournamentCreator;
