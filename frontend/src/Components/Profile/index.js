import React, { useContext, useState, useEffect } from "react";
import { Typography, Card, Popover } from "antd";
import "./index.css";
import { AuthContext } from "../Auth/Auth";
import { CirclePicker } from "react-color";
import { Circle } from "../Util/Circle";
import { EditTwoTone } from "@ant-design/icons";

const { Text } = Typography;
const Profile = () => {
  let { userData, update } = useContext(AuthContext);

  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [col, setCol] = useState();

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setDesc(userData.description);
      setCol(userData.colour);
    }
  }, [userData]);

  const updateName = (value) => {
    userData.name = value;
    setName(value);
    update(userData);
  };
  const updateDesc = (value) => {
    userData.description = value;
    setDesc(value);
    update(userData);
  };

  const updateCol = (value) => {
    console.log(value.hex);
    userData.colour = value.hex;
    setCol(value.hex);
    update(userData);
  };

  const content = (
    <div>
      <CirclePicker onChangeComplete={updateCol} />
    </div>
  );
  return userData ? (
    <div className="user-info">
      <Card
        title={
          <Text strong level="3">
            User information:
          </Text>
        }
      >
        <p>
          <Text level="4" strong>
            Name:{" "}
          </Text>{" "}
          <Text editable={{ onChange: updateName }}>{name}</Text>
        </p>
        <p>
          <Text strong>Description: </Text>{" "}
          <Text editable={{ onChange: updateDesc }}>{desc}</Text>
        </p>
        <p>
          <Text strong>
            Colour: {Circle(col)}{" "}
            <Popover
              content={content}
              title="Choose new colour:"
              trigger="click"
            >
              <EditTwoTone color="blue" />
            </Popover>
          </Text>
        </p>
        <p>
          <Text strong>ID: </Text> {userData.id}
        </p>
        <p>
          <Text strong>Role: </Text> {userData.role}
        </p>
      </Card>
    </div>
  ) : (
    <Card>Loading ...</Card>
  );
};

export default Profile;
