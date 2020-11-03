import { useCallback, useContext } from "react";
import * as React from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../Auth/Auth";
import app, { signInWithGoogle } from "../Base/base";
import { Api } from "../../Api";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        ////////////////////////////////////////
        var user = app.auth().currentUser;
        var user_uid = user.uid;
        console.log(user_uid);
        Api.post("/node")
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error));

        /////////////////////////////////zapytanie do backendu o stworzenie gracza
        history.replace("/dashboard/profile");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  /*
  const GooglehandleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await app.auth();
        signInWithGoogle();
        ////////////////////////////////////////
        var user = app.auth().currentUser;
        var user_uid = user.uid;
        console.log(user_uid);
        Api.post("/node")
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error));

        /////////////////////////////////zapytanie do backendu o stworzenie gracza
        history.replace("/dashboard/profile");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );
*/
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/dashboard/profile" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
      <button onClick={signInWithGoogle}>SIGN IN WITH GOOGLE</button>
      <button onClick={() => history.replace("/signup")}>
        SIGNUP WITH EMAIL
      </button>
    </div>
  );
};

export default withRouter(Login);
