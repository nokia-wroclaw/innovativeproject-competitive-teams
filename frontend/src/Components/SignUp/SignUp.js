import { useCallback } from "react";
import React from "react";
import { withRouter } from "react-router";
import app from "../Base/base";
import { Form, Input, Button, Checkbox } from "antd";

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
  };

  return (
    <Form
      style={{
        position: "absolute",
        left: "45%",
        top: "30%",
        transform: "translate(-50%, -50%)",
      }}
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
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(SignUp);
