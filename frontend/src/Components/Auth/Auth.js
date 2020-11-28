import React, { useEffect, useState } from "react";
import app from "../Base/base";
import { Api } from "../../Api";
import { Notification } from "../Util/Notification";

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [userData, setUserData] = useState(null);
  function update(data) {
    setUserData(data);
    Api.patch(
      `/players/${data.id}`,
      { name: data.name, description: data.description, colour: data.colour },
      { headers: { "firebase-id": "admin" } }
    )
      .then(() => {
        Notification("success", "Success.", "Updated successfully.");
      })
      .catch((error) => {
        Notification(
          "error",
          "Eror when updating",
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        );
      });
  }

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
      if (user) {
        let user_uid = user.uid;
        const rgb = Math.floor(Math.random() * 16777215);
        const random_color = "#" + rgb.toString(16);
        Api.post("/players", {
          name: user_uid.substr(0, 5),
          description: user_uid.substr(5),
          firebase_id: user_uid,
          colour: random_color,
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
        update,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
