import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventDetails, updateEvent, deleteEvent, getEventParticipants } from '../../api/event';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventDetails(id);
        const participantsData = await getEventParticipants(id);
        setEvent(eventData);
        setParticipants(participantsData);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  if (!event) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5">{event.title}</Typography>
      <Typography>{event.description}</Typography>
      <Typography>Date: {event.date}</Typography>
      <Typography>Location: {event.location}</Typography>
      <Typography>Time: {event.time}</Typography>
      <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={() => navigate(`/events/${id}/edit`)}>
        Edit
      </Button>
      <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleDelete}>
        Delete
      </Button>
      <Typography variant="h6" sx={{ mt: 4 }}>Participants</Typography>
      <List>
        {participants.map((participant) => (
          <ListItem key={participant.id}>
            <ListItemText primary={`${participant.first_name} ${participant.last_name}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventDetails;