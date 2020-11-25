import { notification } from "antd";

export function Notification(type, title, msg) {
  notification[type]({
    message: title,
    description: msg,
  });
}
