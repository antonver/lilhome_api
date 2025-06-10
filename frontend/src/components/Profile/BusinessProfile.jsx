import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import {getBusinessProfile, updateBusinessProfile} from "../../api/buisiness";


const BusinessProfile = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    contact_info: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getBusinessProfile();
        setFormData(data);
      } catch (error) {
        console.error('Failed to fetch business profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBusinessProfile(formData);
      // Show success message
    } catch (error) {
      console.error('Business profile update failed:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Business Profile</Typography>
      {Object.keys(formData).map((key) => (
        <TextField
          key={key}
          label={key.replace('_', ' ').toUpperCase()}
          name={key}
          fullWidth
          margin="normal"
          value={formData[key]}
          onChange={handleChange}
        />
      ))}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Update Business Profile
      </Button>
    </Box>
  );
};

export default BusinessProfile;