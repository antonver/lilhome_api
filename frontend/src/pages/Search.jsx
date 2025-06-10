import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import UserSearch from '../components/Search/UserSearch';
import EventSearch from '../components/Search/EventSearch';

const Search = () => {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="User Search" />
        <Tab label="Event Search" />
      </Tabs>
      {tab === 0 && <UserSearch />}
      {tab === 1 && <EventSearch />}
    </Box>
  );
};

export default Search;