import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  zIndex: theme.zIndex.drawer + 1,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  marginLeft: theme.spacing(2),
  fontWeight: 500,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    paddingTop: theme.spacing(2),
  },
}));

const DrawerListItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  '& .MuiListItemText-primary': {
    fontSize: '1.1rem',
    fontWeight: 500,
  },
}));

const Navbar = () => {
  const { isAuthenticated, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
    setMobileOpen(false);
  };

  const navItems = [
    { label: 'Profile', path: '/profile', protected: true },
    { label: 'Events', path: '/events', protected: true },
    { label: 'Search', path: '/search', protected: true },
    { label: 'ChatBot', path: '/chat', protected: true },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: 700, color: '#ffffff', textAlign: 'center' }}
        onClick={() => {
          navigate('/');
          setMobileOpen(false);
        }}
      >
        LilHome
      </Typography>
      <List>
        {navItems.map((item) => (
          (!item.protected || isAuthenticated) && (
            <DrawerListItem
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemText primary={item.label} />
            </DrawerListItem>
          )
        ))}
        <DrawerListItem
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
        </DrawerListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            LilHome
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </StyledDrawer>
      <Toolbar /> {/* Spacer to prevent content from being hidden under fixed AppBar */}
    </Box>
  );
};

export default Navbar;