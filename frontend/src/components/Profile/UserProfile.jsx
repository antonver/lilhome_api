import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { updateUserProfile } from '../../api/user';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    native_language: '',
    spoken_languages: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      // Show success message
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Update Profile</Typography>
      {Object.keys(formData).map((key) => (
        <TextField
          key={key}
          label={key.replace('_', ' ').toUpperCase()}
          name={key}
          type={key === 'age' ? 'number' : 'text'}
          fullWidth
          margin="normal"
          value={formData[key]}
          onChange={handleChange}
        />
      ))}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Box>
  );
};

export default UserProfile;