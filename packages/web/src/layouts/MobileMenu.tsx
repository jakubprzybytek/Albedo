import type { JSX } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { signOut } from "aws-amplify/auth";
import { Link } from 'react-router';

type MenuItemType = {
  link: string;
  label: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItemType[];
};

export default function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps): JSX.Element {
  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box onClick={onClose} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            <Link to='/'>Albedo 2.2</Link>
          </Typography>
          <Divider />
          <List>
            {menuItems.map(menuItem => (
              <ListItem key={menuItem.link}>
                <Link className='full-width' to={menuItem.link}>
                  <ListItemText primary={menuItem.label} sx={{ width: '100%' }} />
                </Link>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <Link className='full-width' to='/settings'>
                <ListItemText primary="Settings" />
              </Link>
            </ListItem>
            <ListItem>
              <ListItemText primary="Log out" onClick={() => signOut()} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
