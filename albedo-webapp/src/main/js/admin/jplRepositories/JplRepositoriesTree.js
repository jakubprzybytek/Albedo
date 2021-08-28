import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 400,
    flexGrow: 1,
    width: 400,
    padding: theme.spacing(1)
  },
  treeItemRoot: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useStyles();
  const { labelText, labelInfo, onClicked, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.treeItemRoot,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      onLabelClick={ () => onClicked() }
      {...other}
    />
  );
}

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
      kernelInfo: kernelInfo,
      children: []
    };
    cache[kernelInfo.observerBody].children.push(newChild); 
    cache[kernelInfo.targetBody] = newChild;
  })

  return root.children.length == 1 ? root.children[0] : root;
}

export default function JplRepositoriesTree(props) {

  const { ephemerisAdminInfo, setSelectedKernelInfo } = props;

  const classes = useStyles();

  const renderTree = (nodes) => (
    <StyledTreeItem key={nodes.name} nodeId={nodes.name}
      labelText={nodes.name}
      labelInfo={nodes.kernelInfo?.kernelFileName}
      onClicked={() => setSelectedKernelInfo(nodes.kernelInfo)}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return (
    <Paper className={classes.root}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}>
        {renderTree(parseKernelInfosToTree(ephemerisAdminInfo))}
      </TreeView>
    </Paper>
  );
}