// src/components/EventForm.jsx
import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, Snackbar, CircularProgress } from '@mui/material';
import {createEvent} from "../../api/event";
import {AuthContext} from "../../contexts/AuthContext";


const EventForm = () => {
  const { isAuthenticated } = useContext(AuthContext);// Debug
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      setError('Please fill out all required fields');
      return;
    }

    if (!isAuthenticated ) {
      console.log('Auth check failed:', { isAuthenticated }); // Debug
      setError('You must be logged in to create an event');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: `${formData.date}T${formData.time}:00Z`,
        time: formData.time,
      };
      console.log('Payload:', payload); // Debug
      await createEvent(payload);
      setFormData({ title: '', description: '', location: '', date: '', time: '' });
      setSuccess(true);
    } catch (error) {
      console.error('Event creation failed:', error.response?.data || error);
      setError(error.response?.data || { detail: 'Failed to create event' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Create Event</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : Object.entries(error).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
        </Alert>
      )}
      <TextField
        label="Title"
        name="title"
        fullWidth
        required
        margin="normal"
        value={formData.title}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Description"
        name="description"
        fullWidth
        margin="normal"
        value={formData.description}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Location"
        name="location"
        fullWidth
        required
        margin="normal"
        value={formData.location}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        fullWidth
        required
        margin="normal"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Time"
        name="time"
        type="time"
        fullWidth
        required
        margin="normal"
        value={formData.time}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Event'}
      </Button>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Event created successfully!"
      />
    </Box>
  );
};

export default EventForm;
