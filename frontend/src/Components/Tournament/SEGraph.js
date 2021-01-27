import React, { useEffect, useState } from "react";
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

const nodeWidth = 250;
const nodeHeight = 90;
const padding = 50;

const SEGraph = ({ tournamentData }) => {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    if (graph === null) {
      const newGraph = new G6.Graph({
        container: "tournament" + tournamentData.id,
        width: Math.log2(tournamentData.teams.length) * (nodeWidth + padding),
        height: (tournamentData.teams.length / 2) * (nodeHeight + padding),
        defaultNode: {
          type: "modelRect",
          size: [nodeWidth, nodeHeight],
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
          descriptionCfg: {
            paddingTop: 10,
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
      setGraph(newGraph);
    }
  }, [tournamentData, graph]);

  useEffect(() => {
    if (graph !== null) {
      let grapahData = { nodes: [], edges: [] };
      let stageMatches = Math.floor(tournamentData.teams.length / 2);
      let stage = 0;
      while (stageMatches > 0) {
        // Nodes
        for (let i = 0; i < stageMatches; i++) {
          grapahData.nodes.push({
            id: "node" + (grapahData.nodes.length + 1),
            label: "TBD",
            description: "Stage " + (stage + 1),
            x: (nodeWidth + padding) / 2 + stage * (nodeWidth + padding),
            y:
              i * (nodeHeight + padding) * Math.pow(2, stage) +
              (Math.pow(2, stage) * (nodeHeight + padding)) / 2,
          });
        }

        stageMatches = Math.floor(stageMatches / 2);

        // Edges
        for (let i = 0; i < stageMatches; i++) {
          grapahData.edges.push(
            {
              source:
                "node" +
                ((stage > 0 ? grapahData.nodes.length - stageMatches * 2 : 0) +
                  (i + 1) * 2 -
                  1),
              target: "node" + (grapahData.nodes.length + i + 1),
            },
            {
              source:
                "node" +
                ((stage > 0 ? grapahData.nodes.length - stageMatches * 2 : 0) +
                  (i + 1) * 2),
              target: "node" + (grapahData.nodes.length + i + 1),
            }
          );
        }
        stage++;
      }

      // Match data
      const sortedMatches = tournamentData.matches.sort(
        (a, b) => a.tournament_place - b.tournament_place
      );
      for (let i = 0; i < sortedMatches.length; i++) {
        const match = sortedMatches[i];
        const score = match.finished
          ? `${match.score1} : ${match.score2}`
          : "TBD";
        const team1 = match.team1 !== null ? match.team1.name : "TBD";
        const team2 = match.team2 !== null ? match.team2.name : "TBD";
        grapahData.nodes[i].label = `${team1} vs ${team2}`;
        grapahData.nodes[i].description = `${match.name}\nScore: ${score}`;
        if (!match.finished) grapahData.nodes[i].stateIcon = { show: false };
      }

      graph.data(grapahData);
      graph.clear();
      graph.render();
    }
  }, [tournamentData, graph]);

  return (
    <div style={{ overflow: "auto" }}>
      <div id={"tournament" + tournamentData.id}></div>
    </div>
  );
};

export default SEGraph;
