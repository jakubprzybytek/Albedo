import { useState } from 'react';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
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

export default function Navigation(): JSX.Element {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        <Link href='/'>Albedo 2.0</Link>
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <Typography variant="h6" component="div">
                            <Link href='/states'>States</Link>
                        </Typography>
                        <Typography variant="h6" component="div">
                            <Link href='/ephemeris'>Ephemeris</Link>
                        </Typography>
                        <Button variant="contained" color="secondary" size='small' onClick={() => Auth.signOut()}>Log out</Button>
                    </Stack>
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
                            <ListItem disablePadding>
                                <ListItemButton sx={{ textAlign: 'center' }}>
                                    <Link href='/states'><ListItemText primary="States" /></Link>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ textAlign: 'center' }}>
                                    <Link href='/ephemeris'><ListItemText primary="Ephemeris" /></Link>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            </Box>
        </>
    )
}
