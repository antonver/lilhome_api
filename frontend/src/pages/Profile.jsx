import React, { useContext } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import UserProfile from '../components/Profile/UserProfile';
import BusinessProfile from '../components/Profile/BusinessProfile';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="User Profile" />
        {user?.is_business && <Tab label="Business Profile" />}
      </Tabs>
      {tab === 0 && <UserProfile />}
      {tab === 1 && user?.is_business && <BusinessProfile />}
    </Box>
  );
};

export default Profile;