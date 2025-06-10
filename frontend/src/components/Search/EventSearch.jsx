import React, { useState } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { searchEvents } from '../../api/event';
import { useNavigate } from 'react-router-dom';

const EventSearch = () => {
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    location: '',
  });
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await searchEvents(filters);
      setResults(data);
    } catch (error) {
      console.error('Event search failed:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Event Search</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {Object.keys(filters).map((key) => (
          <TextField
            key={key}
            label={key.replace('_', ' ').toUpperCase()}
            name={key}
            type={key.includes('date') ? 'date' : 'text'}
            fullWidth
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        ))}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Search
        </Button>
      </Box>
      <List sx={{ mt: 4 }}>
        {results.map((event) => (
          <ListItem key={event.id} onClick={() => navigate(`/events/${event.id}`)} sx={{ cursor: 'pointer' }}>
            <ListItemText primary={event.title} secondary={`${event.date} - ${event.location}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventSearch;