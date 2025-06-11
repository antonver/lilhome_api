import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
import { getEvents, joinEvent, leaveEvent } from '../../api/event';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleJoin = async (id) => {
    console.log(id)
    try {
      await joinEvent(id);
      setEvents(events.map(event =>
        event.id === id ? { ...event, participants: [...event.participants, {}] } : event
      ));
    } catch (error) {
      console.error('Failed to join event:', error);
    }
  };

  const handleLeave = async (id) => {
    try {
      await leaveEvent(id);
      setEvents(events.map(event =>
        event.id === id ? { ...event, participants: event.participants.slice(0, -1) } : event
      ));
    } catch (error) {
      console.error('Failed to leave event:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Events</Typography>
      <List>
        {events.map((event) => (
          <ListItem key={event.id} divider>
            <ListItemText
              primary={event.title}
              secondary={`${event.date} - ${event.location}`}
              onClick={() => navigate(`/events/${event.id}`)}
              sx={{ cursor: 'pointer' }}
            />
            <Button onClick={() => handleJoin(event.id)} sx={{ mr: 1 }}>Join</Button>
            <Button onClick={() => handleLeave(event.id)} color="error">Leave</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventList;
