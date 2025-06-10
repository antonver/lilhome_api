import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import EventList from '../components/Event/EventList';
import EventForm from '../components/Event/EventForm';

const Events = () => {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="Events" />
        <Tab label="Create Event" />
      </Tabs>
      {tab === 0 && <EventList />}
      {tab === 1 && <EventForm />}
    </Box>
  );
};

export default Events;