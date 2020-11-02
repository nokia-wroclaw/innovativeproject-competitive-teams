import firebase from "firebase/app";
import "firebase/auth";

export function loggedIn() {
  var user = firebase.auth().currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
}

export function loggedInUserID() {
  var user = firebase.auth().currentUser;
  if (user) {
    return user.uid;
  } else {
    return null;
  }
}
