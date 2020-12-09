import React, { useEffect, useState } from "react";
import { Slider } from "antd";
import "./index.css";
import G6 from "@antv/g6";

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

const SEGraph = ({ id, matches }) => {
  // If no id has been passed, check router params
  const [graph, setGraph] = useState(null);
  const [numTeams, setNumTeams] = useState(8);

  const onSizeChange = (num) => {
    if (graph && numTeams !== num) {
      graph.destroy();
      setNumTeams(num);
    }
  };

  useEffect(() => {
    const newGraph = new G6.Graph({
      container: "tournament" + id,
      width: Math.log2(numTeams) * 300,
      height: (numTeams / 2 - 1) * 120 + 80 + 30,
      defaultNode: {
        type: "modelRect",
        size: [250, 80],
        style: {
          fill: "#3f3f3f",
          stroke: "#aaa",
          radius: 3,
        },
        labelCfg: {
          style: {
            fill: "#fff",
            fontSize: 20,
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: "#666",
          lineWidth: 2,
        },
        type: "ladder",
      },
    });

    let mock_data = { nodes: [], edges: [] };
    let matches = Math.floor(numTeams / 2);
    let stage = 0;
    while (matches > 0) {
      // Nodes
      for (let i = 0; i < matches; i++) {
        mock_data.nodes.push({
          id: "node" + (mock_data.nodes.length + 1),
          label: "TBD",
          description: "Stage " + (stage + 1),
          x: 150 + stage * 300,
          y: i * 120 * Math.pow(2, stage) + Math.pow(2, stage) * 60,
        });
      }

      matches = Math.floor(matches / 2);

      // Edges
      for (let i = 0; i < matches; i++) {
        mock_data.edges.push(
          {
            source:
              "node" +
              ((stage > 0 ? mock_data.nodes.length - matches * 2 : 0) +
                (i + 1) * 2 -
                1),
            target: "node" + (mock_data.nodes.length + i + 1),
          },
          {
            source:
              "node" +
              ((stage > 0 ? mock_data.nodes.length - matches * 2 : 0) +
                (i + 1) * 2),
            target: "node" + (mock_data.nodes.length + i + 1),
          }
        );
      }
      stage++;
    }

    // Team labels
    for (let i = 1; i <= numTeams / 2; i++)
      mock_data.nodes[i - 1].label = `Team ${2 * i - 1} vs Team ${2 * i}`;

    newGraph.data(mock_data);
    newGraph.render();
    setGraph(newGraph);
  }, [id, numTeams]);

  return (
    <div style={{ overflow: "auto" }}>
      <Slider
        marks={{ 2: 2, 4: 4, 8: 8, 16: 16, 32: 32, 64: 64 }}
        step={null}
        defaultValue={8}
        onAfterChange={onSizeChange}
      />
      <div id={"tournament" + id}></div>
    </div>
  );
};

export default SEGraph;
