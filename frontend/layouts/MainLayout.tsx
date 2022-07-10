import { useTheme } from '@mui/material/styles';
import Head from "next/head";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Auth } from "aws-amplify";

type MainLayoutParams = {
    children: JSX.Element;
};

export default function MainLayout({ children }: MainLayoutParams): JSX.Element {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Albedo 2.0</title>
                <meta name="description" content="Albedo. Predicting astronomical events." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        Albedo 2.0
                    </Typography>
                    <Button variant="contained" color="secondary" size='small' onClick={() => Auth.signOut()}>Log out</Button>
                </Toolbar>
            </AppBar>
            <Box component="main" bgcolor={theme.palette.background.default} sx={{ minHeight: '100vh' }}>
                <Toolbar />
                {children}
            </Box>
        </>
    )
}
