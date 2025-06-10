import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  marginLeft: theme.spacing(2),
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
}));

const DrawerList = styled(List)(({ theme }) => ({
  width: 250,
  backgroundColor: '#1a1a1a',
  height: '100%',
  color: '#ffffff',
}));

const Navbar = () => {
  const { isAuthenticated, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile', protected: true },
    { label: 'Events', path: '/events', protected: true },
    { label: 'Search', path: '/search', protected: true },
  ];

  const drawer = (
    <DrawerList>
      {navItems.map((item) => (
        (!item.protected || isAuthenticated) && (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        )
      ))}
      <ListItem
        button
        onClick={() => {
          if (isAuthenticated) {
            handleSignOut();
          } else {
            navigate('/login');
            setMobileOpen(false);
          }
        }}
      >
        <ListItemText primary={isAuthenticated ? 'Logout' : 'Login'} />
      </ListItem>
    </DrawerList>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            LilHome
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {navItems.map((item) => (
              (!item.protected || isAuthenticated) && (
                <NavButton key={item.label} onClick={() => navigate(item.path)}>
                  {item.label}
                </NavButton>
              )
            ))}
            <NavButton onClick={isAuthenticated ? handleSignOut : () => navigate('/login')}>
              {isAuthenticated ? 'Logout' : 'Login'}
            </NavButton>
          </Box>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
      <Toolbar /> {/* Spacer to prevent content from being hidden under fixed AppBar */}
    </Box>
  );
};

export default Navbar;