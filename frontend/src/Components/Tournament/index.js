import React, { useEffect, useState } from "react";
import { Slider } from "antd";
import { useParams } from "react-router-dom";
import "./index.css";
import G6 from "@antv/g6";

import SEGraph from "./SEGraph";

G6.registerEdge("ladder", {
  draw(cfg, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    const shape = group.addShape("path", {
      attrs: {
        stroke: "#333",
        path: [
          ["M", startPoint.x, startPoint.y],
          ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 1/3
          ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 2/3
          ["L", endPoint.x, endPoint.y],
        ],
      },
      name: "ladder-path-shape",
    });
    return shape;
  },
});

const Tournament = ({ id }) => {
  // If no id has been passed, check router params
  const { tournamentid } = useParams();
  if (id === null || id === undefined) id = tournamentid;

  return (
    <div style={{ overflow: "auto" }}>
      <SEGraph id={id} maches={[]} />
    </div>
  );
};

export default Tournament;
