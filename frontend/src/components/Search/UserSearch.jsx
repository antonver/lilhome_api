import React, { useState } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { searchUsers } from '../../api/user';

const UserSearch = () => {
  const [filters, setFilters] = useState({
    age_min: '',
    age_max: '',
    gender: '',
    language: '',
    location: '',
  });
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await searchUsers(filters);
      setResults(data);
    } catch (error) {
      console.error('User search failed:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>User Search</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {Object.keys(filters).map((key) => (
          <TextField
            key={key}
            label={key.replace('_', ' ').toUpperCase()}
            name={key}
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
        ))}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Search
        </Button>
      </Box>
      <List sx={{ mt: 4 }}>
        {results.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={`${user.first_name} ${user.last_name}`} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserSearch;