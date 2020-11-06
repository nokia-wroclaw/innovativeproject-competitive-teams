import { useCallback, useContext } from "react";
import * as React from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../Auth/Auth";
import app, { signInWithGoogle } from "../Base/base";
import { Space, Card, Row, Form, Input, Button } from "antd";
import { Api } from "../../Api";
import { Anchor } from "antd";

const { Link } = Anchor;
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
    history.replace("/dashboard/profile");
    ///basic fireb-db connection:

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
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/dashboard/profile" />;
  }

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
            <Space direction="vertical" size={5}>
              <Space size={5}>
                <Button type="primary" htmlType="submit">
                  Sign in
                </Button>
                <Button onClick={signInWithGoogle}>Sign in with Google</Button>
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

/*
<Button onClick={() => history.replace("/signup")}>
        Sign up with email
      </Button>
      */
