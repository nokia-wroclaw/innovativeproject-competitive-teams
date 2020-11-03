import { useCallback } from "react";
import React from "react";
import { withRouter } from "react-router";
import app from "../Base/base";
import { Api } from "../../Api";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        ////////////////////////////////////////
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

        /////////////////////////////////zapytanie do backendu o stworzenie gracza
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
