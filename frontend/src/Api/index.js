import axios from "axios";

var BACKEND_URL = "/api";

// check for local development backend url
const env_url = process.env.REACT_APP_BACKEND_URL;
const env = process.env.NODE_ENV;
if (env === "development" && env_url != null) BACKEND_URL = env_url;

export const Api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
});
