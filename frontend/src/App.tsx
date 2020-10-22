import React, { Component } from "react";
import Api, { User } from "./api/Api";

interface IProps {}

interface IState {
  users?: any;
}

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  async getUsers() {
    let backend: Api = new Api();
    let result = await backend.getUsers();
    this.setState({ users: result });
    console.log(this.state.users);
  }

  render() {
    if (this.state.users) {
      const listItems = this.state.users.map((u: User) => (
        <li key={u.id}>{u.email}</li>
      ));
      return (
        <div>
          <p>Hello World</p>
          <p>Users:</p>
          {listItems}
        </div>
      );
    }

    return (
      <div>
        <p>Hello World</p>
        <div>Loading...</div>
      </div>
    );
  }
}

export default App;
