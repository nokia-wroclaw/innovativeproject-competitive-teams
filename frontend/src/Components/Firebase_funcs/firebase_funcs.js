import firebase from "firebase/app";
import "firebase/auth";

export function loggedIn() {
  let user = firebase.auth().currentUser;
  return user !== null;
}

export function getUserID() {
  let user = firebase.auth().currentUser;
  return user?.uid || null;
}
