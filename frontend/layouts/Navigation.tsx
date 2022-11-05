import { useState } from 'react';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Auth } from "aws-amplify";

type NavigationParamsType = {
    title: string;
}

const menuItems = [
    {
        link: '/states',
        label: 'States'
    },
    {
        link: '/ephemeris',
        label: 'Ephemeris'
    },
    {
        link: '/separations',
        label: 'Separations'
    },
    {
        link: '/conjunctions',
        label: 'Conjunctions'
    },
    {
        link: '/eclipses',
        label: 'Eclipses'
    }
];

export default function Navigation({ title }: NavigationParamsType): JSX.Element {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Link href='/'>Albedo 2.0</Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 2 }}>
                        {title}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <Button variant="contained" color="secondary" size='small' onClick={handleMenu}>
                            Tools
                        </Button>
                        <Button variant="contained" color="secondary" size='small' onClick={() => Auth.signOut()}>
                            Log out
                        </Button>
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
                                <Link href={menuItem.link}>{menuItem.label}</Link>
                            </MenuItem>
                        ))}
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={isMobileOpen}
                    onClose={() => setIsMobileOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    <Box onClick={() => setIsMobileOpen(!isMobileOpen)} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ my: 2 }}>
                            <Link href='/'>Albedo 2.0</Link>
                        </Typography>
                        <Divider />
                        <List>
                            {menuItems.map(menuItem => (
                                <ListItem key={menuItem.link} disablePadding>
                                    <ListItemButton sx={{ textAlign: 'center' }}>
                                        <Link href={menuItem.link}><ListItemText primary={menuItem.label} /></Link>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <Typography variant="h6" sx={{ my: 2 }}
                            onClick={() => Auth.signOut()}>
                            Log out
                        </Typography>
                    </Box>
                </Drawer>
            </Box>
        </>
    )
}
