import * as React from "react";
import { withRouter } from "react-router";
import app, { signInWithGoogle } from "../Base/base";
import { Space, Card, Row, Form, Input, Button } from "antd";
import { CreatePlayer } from "../Util/CreatePlayer";

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
    span: 15,
  },
};

const LogIn = ({ history }) => {
  const onFinish = (values) => {
    app.auth().signInWithEmailAndPassword(values.username, values.password);
    app.auth().onAuthStateChanged((user) => {
      history.replace("/dashboard/profile");
    });
  };

  const onFinishGoogle = () => {
    signInWithGoogle();
    app.auth().onAuthStateChanged((user) => {
      CreatePlayer(user);
      history.replace("/dashboard/profile");
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Row
      type="flex"
      justify="middle"
      align="center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        title="Sign in"
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
          onFinishFailed={onFinishFailed}
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
            <Space direction="vertical" size={5}>
              <Space size={5}>
                <Button type="primary" htmlType="submit">
                  Sign in
                </Button>
                <Button onClick={onFinishGoogle}>Sign in with Google</Button>
              </Space>
              <a href="/SignUp">Sign Up</a>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Row>
  );
};

export default withRouter(LogIn);
