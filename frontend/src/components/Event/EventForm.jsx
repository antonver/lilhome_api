import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { createEvent } from '../../api/event';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const combinedDateTime = formData.date && formData.time
        ? `${formData.date}T${formData.time}:00Z`
        : null;
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: combinedDateTime,
      };
      console.log('Event payload:', payload);
      await createEvent(payload);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Event creation failed:', error.response?.data || error);
      setError(error.response?.data || { detail: 'Failed to create event' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Create Event</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {Object.entries(error).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
        </Alert>
      )}
      <TextField
        label="Title"
        name="title"
        fullWidth
        margin="normal"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Description"
        name="description"
        fullWidth
        margin="normal"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Location"
        name="location"
        fullWidth
        margin="normal"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        fullWidth
        margin="normal"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Time"
        name="time"
        type="time"
        fullWidth
        margin="normal"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Create Event
      </Button>
    </Box>
  );
};

export default EventForm;