import React from 'react';
import Paper from '@material-ui/core/Paper';

import { Graph } from "react-d3-graph";

const myConfig = {
  nodeHighlightBehavior: true,
  automaticRearrangeAfterDropNode: true,
  height: 800,
  width: 800,
  maxZoom: 3,
  minZoom: 1,
  initialZoom: 2,
  node: {
    color: "lightgreen",
    size: 300,
    fontSize:10,
    highlightFontSize:10,
    highlightStrokeColor: "blue",

    symbolType: "circle"
  },
  link: {
    highlightColor: "lightblue",
    renderLabel: true,
    labelProperty: "label"
  }
};

function parseKernelInfos(kernelInfos) {
  var nodesAdded = new Set();
  var nodes = [];
  var links = [];

  kernelInfos.forEach(kernelInfo => {
    if (!nodesAdded.has(kernelInfo.observerBody)) {
      nodesAdded.add(kernelInfo.observerBody);
      nodes.push({
        id: kernelInfo.observerBody,
        symbolType: "diamond",
        color: "red",
        size: 300
      });
    }
    if (!nodesAdded.has(kernelInfo.targetBody)) {
      nodesAdded.add(kernelInfo.targetBody);
      nodes.push({
        id: kernelInfo.targetBody
      });
    }

    links.push({
      source: kernelInfo.observerBody,
      target: kernelInfo.targetBody,
      label: kernelInfo.kernelFileName
    })
  });

  return {
    nodes: nodes,
    links: links
  }
}

export default function JplRepositoriesGraph(props) {

  const { ephemerisAdminInfo, setSelectedGraphLink, setSelectedNode } = props;

  return (
    <Paper>
      <Graph id={"graph"}
        data={parseKernelInfos(ephemerisAdminInfo)}
        config={myConfig}
        onClickNode={(nodeId) => setSelectedNode(nodeId)}
        onClickLink={(source, target) => setSelectedGraphLink( { source: source, target: target } )} />
    </Paper>
  );
}
