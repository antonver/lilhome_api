import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { register } from '../../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    native_language: '',
    spoken_languages: '',
    location: '',
    is_business: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      // Redirect or show success message
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      {Object.keys(formData).map((key) => (
        key !== 'is_business' ? (
          <TextField
            key={key}
            label={key.replace('_', ' ').toUpperCase()}
            name={key}
            type={key === 'password' ? 'password' : key === 'age' ? 'number' : 'text'}
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
        ) : (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <input
              type="checkbox"
              name="is_business"
              checked={formData.is_business}
              onChange={handleChange}
            />
            <Typography sx={{ ml: 1 }}>Business Account</Typography>
          </Box>
        )
      ))}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;