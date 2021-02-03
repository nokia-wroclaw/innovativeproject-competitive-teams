import React from "react";
import { withRouter } from "react-router";
import app from "../Base/base";
import { Card, Row, Form, Input, Button } from "antd";
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
    span: 16,
  },
};

const SignUp = ({ history }) => {
  const onFinish = (values) => {
    app.auth().onAuthStateChanged(() => {
      history.replace("/dashboard/profile");
    });
    app
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        Notification(
          "success",
          "Success!",
          "Your account has been created successfully!"
        );
      })
      .catch((error) => {
        let errorMessage = error.message;
        Notification("error", "Error", errorMessage);
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
