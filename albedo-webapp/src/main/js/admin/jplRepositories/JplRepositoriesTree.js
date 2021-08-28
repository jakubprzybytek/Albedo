import React from 'react';
import Paper from '@material-ui/core/Paper';

import Tree from "react-d3-tree";

function parseKernelInfosToTree(kernelInfos) {
  const root = { name: 'root', children: [] };

  const cache = {};

  kernelInfos.forEach(kernelInfo => {
    
    if (!(kernelInfo.observerBody in cache)) {
      const newObserverBodyNode = { name: kernelInfo.observerBody, children: [] };
      cache[kernelInfo.observerBody] = newObserverBodyNode;
      root.children.push(newObserverBodyNode);
    }

    const newChild = { 
      name: kernelInfo.targetBody,
      attributes: {
        file: kernelInfo.kernelFileName,
//        referenceFrame: kernelInfo.referenceFrame,
//        positionChebyshevRecords: kernelInfo.positionChebyshevRecords,
//        positionAndVelocityChebyshevRecords: kernelInfo.positionAndVelocityChebyshevRecords
      },
      children: []
    };
    cache[kernelInfo.observerBody].children.push(newChild); 
    cache[kernelInfo.targetBody] = newChild;
  })

  return root.children.length == 1 ? root.children[0] : root;
}



export default function JplRepositoriesTree(props) {

  const renderNodeWithCustomEvents = ({ nodeDatum, toggleNode }) => (
    <g>
      <foreignObject x="0" height="120px" width="500px" y="-60px">
        <div className="elemental-node">
          <span className="elemental-name">
            {nodeDatum.name}
          </span>
          <span className="elemental-name">
            {nodeDatum.attributes?.kernelFileName}
          </span>
        </div>
      </foreignObject>
    </g>
  );

  const { ephemerisAdminInfo, setSelectedGraphLink, setSelectedNode } = props;

  console.log(parseKernelInfosToTree(ephemerisAdminInfo));

  return (
    <Paper style={{ width: '800px', height: '800px' }}>
      <Tree 
        data={parseKernelInfosToTree(ephemerisAdminInfo)}
        pathFunc={'step'}
 //       renderCustomNodeElement={(rd3tProps) =>
 //         renderNodeWithCustomEvents({ ...rd3tProps })
 //       }
        />
    </Paper>
  );
}
