import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { CreatePlayer } from "../Util/CreatePlayer";
import { Api } from "../../Api";

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
