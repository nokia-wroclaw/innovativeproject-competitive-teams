import app from "../Base/base";
import { Api } from "../../Api";

export function CreatePlayer() {
  const user = app.auth().currentUser;
  let user_uid = user.uid;
  console.log(user_uid);
  Api.post("/players", {
    name: user_uid.substr(0, 5),
    description: user_uid.substr(5),
    firebase_id: user_uid,
  })
    .then((response) => console.log(response.data))
    .catch((error) => console.log(error));
}
