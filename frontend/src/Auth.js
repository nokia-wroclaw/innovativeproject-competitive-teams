/*import  { useEffect, useState } from "react";
import * as React from "react";
import app from "./base";




export const AuthContext = React.createContext(null);

export const AuthProvider: React.FC<{}> = ({ children }) => {
const [currentUser, setCurrentUser] = useState(null);
const [pending, setPending] = useState(true);

useEffect(() => {
app.auth().onAuthStateChanged((user) => {
setCurrentUser(user)
setPending(false)
});
}, []);

if(pending){
return <>Loading...</>
}

return (
<AuthContext.Provider
value={{
currentUser
}}
>
{children}
</AuthContext.Provider>
);
};*/
import React, { useEffect, useState } from "react";
import app from "./base";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  }, []);

  if(pending){
    return <>Loading...</>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};