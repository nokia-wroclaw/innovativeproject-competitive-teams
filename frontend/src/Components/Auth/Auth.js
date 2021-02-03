import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import app from "../Base/base";
import { Api } from "../../Api";
import { Notification } from "../Util/Notification";

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const queryClient = useQueryClient();

  function update(data) {
    setUserData(data);
    Api.patch(
      `/players/${data.id}`,
      { name: data.name, description: data.description, colour: data.colour },
      { headers: { "firebase-id": currentUser.uid } }
    )
      .then(() => {
        Notification("success", "Success", "Updated successfully.");
        queryClient.refetchQueries(["userData", currentUser]);
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

  useQuery(
    ["userData", currentUser],
    async () => {
      const res = await Api.get(`/players/firebase_id/${currentUser.uid}`, {
        headers: { "firebase-id": currentUser.uid },
      });
      setUserData(res.data);
      return res.data;
    },
    {
      enabled: !!currentUser,
    }
  );

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
      if (user) {
        let user_uid = user.uid;
        const rgb = Math.floor(Math.random() * 16777215);
        const random_color = "#" + rgb.toString(16);
        Api.post("/players/", {
          name: user_uid.substr(0, 5),
          description: "Empty",
          firebase_id: user_uid,
          colour: random_color,
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
