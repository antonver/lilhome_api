import React from 'react';
import { Box, Typography, Button, Container, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
  color: '#ffffff',
  textAlign: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 70%)',
    zIndex: 1,
  },
}));

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  borderRadius: '50px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
  },
}));

const Home = () => {
  const navigate = useNavigate();

  return (
    <HeroContainer>
      <Container maxWidth="md">
        <ContentWrapper>
          <Fade in timeout={1000}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to LilHome
            </Typography>
          </Fade>
          <Fade in timeout={1500}>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: '#cccccc',
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Connect, create, and collaborate in your community with ease.
            </Typography>
          </Fade>
          <Fade in timeout={2000}>
            <Box>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Login
              </StyledButton>
              <StyledButton
                variant="outlined"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#f0f0f0',
                    color: '#f0f0f0',
                  },
                }}
              >
                Register
              </StyledButton>
            </Box>
          </Fade>
        </ContentWrapper>
      </Container>
    </HeroContainer>
  );
};

export default Home;