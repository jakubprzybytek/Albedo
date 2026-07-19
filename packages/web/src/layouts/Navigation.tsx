import { useState, type JSX } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

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
    link: '/altitudes',
    label: 'Altitudes'
  },
  {
    link: '/visibility',
    label: 'Visibility'
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
    link: '/dso-conjunctions',
    label: 'DSO Conjunctions'
  },
  {
    link: '/eclipses',
    label: 'Eclipses'
  }
];

export default function Navigation({ title }: NavigationParamsType): JSX.Element {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Link to='/'>Albedo 2.2</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 2 }}>
            {title}
          </Typography>
          <IconButton color="inherit" edge="start" sx={{ display: { sm: 'none' } }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}>
            <MenuIcon />
          </IconButton>
          <DesktopMenu menuItems={menuItems} />
        </Toolbar>
      </AppBar>
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        menuItems={menuItems}
      />
    </>
  )
}
