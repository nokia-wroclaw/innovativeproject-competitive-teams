import { notification } from "antd";

export function Notification(type, title, msg) {
  notification[type]({
    message: title,
    description:
      Array.isArray(msg) && msg[0].msg !== undefined ? msg[0].msg : msg,
  });
}
