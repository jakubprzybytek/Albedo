import { useState, type JSX } from 'react';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { signOut } from "aws-amplify/auth";
import { Link } from 'react-router';

type MenuItemType = {
  link: string;
  label: string;
};

type DesktopMenuProps = {
  menuItems: MenuItemType[];
};

export default function DesktopMenu({ menuItems }: DesktopMenuProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
        <Button variant="contained" color="secondary" size='small' onClick={handleMenu}>
          Tools
        </Button>
        <IconButton color="inherit" onClick={handleAccountMenu}>
          <AccountCircle />
        </IconButton>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map(menuItem => (
          <MenuItem key={menuItem.link} onClick={handleClose}>
            <Link to={menuItem.link}>{menuItem.label}</Link>
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={accountAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(accountAnchorEl)}
        onClose={handleAccountClose}
      >
        <MenuItem onClick={handleAccountClose}>
          <Link to='/settings'>Settings</Link>
        </MenuItem>
        <MenuItem onClick={() => {
          handleAccountClose();
          signOut();
        }}>
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
