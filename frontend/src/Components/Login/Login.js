import * as React from "react";
import { withRouter } from "react-router";
import app, { signInWithGoogle } from "../Base/base";
import { Space, Card, Row, Form, Input, Button } from "antd";
import { Notification } from "../Util/Notification";

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
    app.auth().onAuthStateChanged(() => {
      history.replace("/dashboard/profile");
    });
    app
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        history.replace("/dashboard/profile");
        Notification("success", "Success!", "You have been signed in!");
      })
      .catch((error) => {
        let errorMessage = error.message;
        Notification("error", "Error", errorMessage);
      });
  };

  const onFinishGoogle = () => {
    app.auth().onAuthStateChanged(() => {
      history.replace("/dashboard/profile");
    });
    signInWithGoogle().then(() => {
      Notification("success", "Success!", "You have been signed in!");
    });
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
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your e-mail!",
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
