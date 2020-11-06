import React from "react";
import { withRouter } from "react-router";
import app from "../Base/base";
import { Card, Row, Form, Input, Button } from "antd";
import { Api } from "../../Api";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const SignUp = ({ history }) => {
  const onFinish = (values) => {
    app.auth().createUserWithEmailAndPassword(values.username, values.password);
    history.push("/");
    var user = app.auth().currentUser;
    var user_uid = user.uid;
    console.log(user_uid);

    Api.post("/players", {
      name: user_uid.substr(0, 5),
      description: user_uid.substr(5),
      firebase_id: user_uid,
    })
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <Row
      type="flex"
      justify="middle"
      align="center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        title="Sign up"
        justify="middle"
        allign="center"
        style={{ width: 450 }}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={console.log("error")}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" size="large">
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Row>
  );
};

export default withRouter(SignUp);
