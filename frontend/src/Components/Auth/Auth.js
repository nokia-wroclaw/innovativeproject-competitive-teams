import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { CreatePlayer } from "../Util/CreatePlayer";
import { Api } from "../../Api";
/*
async function Get_username(user) {
  await Api.get(`/players/firebase_id/${user.uid}`, {
    name: user.uid.substr(0, 5),
  })
    .then(function (response) {
      console.log(response.data["name"]);
      return response.data["name"];
    })
    .catch(function (error) {
      console.log(error);
    });
}
*/
export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      CreatePlayer(user);
      setPending(false);
      if (user) {
        Api.get(`/players/firebase_id/${user.uid}`, {
          headers: { "firebase-id": user.uid },
        })
          .then(function (response) {
            setUserData(response.data);
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  }, []);

  if (pending) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
