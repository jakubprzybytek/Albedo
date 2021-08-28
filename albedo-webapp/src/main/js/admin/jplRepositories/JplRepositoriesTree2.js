import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const data = {
  id: 'root',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1',
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

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
      file: kernelInfo.kernelFileName,
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

export default function JplRepositoriesTree2(props) {

  const { ephemerisAdminInfo } = props;

  const classes = useStyles();

  const renderTree = (nodes) => (
    <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name + ' (' + nodes.file + ')'}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <Paper>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(parseKernelInfosToTree(ephemerisAdminInfo))}
      </TreeView>
    </Paper>
  );
}