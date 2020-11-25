import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { Api } from "../../Api";

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
      if (user) {
        let user_uid = user.uid;
        Api.post("/players", {
          name: user_uid.substr(0, 5),
          description: user_uid.substr(5),
          firebase_id: user_uid,
        }).then(() => {
          Api.get(`/players/firebase_id/${user.uid}`, {
            headers: { "firebase-id": user.uid },
          })
            .then(function (response) {
              setUserData(response.data);
            })
            .catch(function (error) {
              console.log(error);
            });
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
