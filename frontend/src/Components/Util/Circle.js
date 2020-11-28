import { Avatar } from "antd";
import React from "react";

export function Circle(color) {
  return (
    <Avatar
      style={{
        backgroundColor: color,
        verticalAlign: "middle",
        marginRight: 25,
      }}
      size="small"
    ></Avatar>
  );
}
