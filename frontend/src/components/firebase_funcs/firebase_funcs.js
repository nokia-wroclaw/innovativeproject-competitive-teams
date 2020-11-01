import firebase from "firebase/app";
import "firebase/auth";

export function is_logged() {
  var user = firebase.auth().currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
}

export function user_id() {
  var user = firebase.auth().currentUser;
  if (user) {
    return user.uid;
  } else {
    return false;
  }
}
