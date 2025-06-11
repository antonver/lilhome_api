import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Modal,
  TextField,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getEventDetails, updateEvent, deleteEvent, getEventParticipants } from '../../api/event';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal states
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventDetails(id);
        const participantsData = await getEventParticipants(id);
        setEvent(eventData);
        setParticipants(participantsData);
        // Initialize edit form
        setEditForm({
          title: eventData.title,
          description: eventData.description || '',
          location: eventData.location,
          date: eventData.date.split('T')[0], // Extract YYYY-MM-DD
          time: eventData.time.slice(0, 5), // Extract HH:MM
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setError('Failed to load event details');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => {
    setEditOpen(false);
    setEditError(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.date || !editForm.time || !editForm.location) {
      setEditError('Please fill out all required fields');
      return;
    }

    setEditLoading(true);
    try {
      const payload = {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        date: `${editForm.date}T${editForm.time}:00Z`,
        time: `${editForm.time}:00`,
      };
      console.log('Edit payload:', payload); // Debug
      await updateEvent(id, payload);
      setEvent({ ...event, ...payload }); // Update local state
      handleEditClose();
    } catch (error) {
      console.error('Failed to update event:', error.response?.data || error);
      setEditError(error.response?.data || { detail: 'Failed to update event' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (error) {
      console.error('Failed to delete event:', error);
      setError('Failed to delete event');
      setDeleteLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>{error}</Alert>;
  if (!event) return null;

  return (
    <Fade in>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 6 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: 200,
              background: 'linear-gradient(135deg, #111111 0%, #ffffff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" color="white" fontWeight="bold">
              {event.title}
            </Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              {event.description || 'No description provided.'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Date:</strong>{' '}
              {format(new Date(event.date), 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Time:</strong> {format(new Date(`1970-01-01T${event.time}`), 'h:mm a')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              <strong>Location:</strong> {event.location}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditOpen}
                  sx={{ borderRadius: 2,
                  background:"purple"
                  }}
                >
                  Edit Event
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteOpen}
                  sx={{ borderRadius: 2 }}
                >
                  Delete Event
                </Button>
              </motion.div>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'medium' }}>
          Participants
        </Typography>
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <List>
            {participants.length === 0 ? (
              <ListItem>
                <ListItemText primary="No participants yet." />
              </ListItem>
            ) : (
              participants.map((participant) => (
                <ListItem
                  key={participant.id}
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {participant.first_name[0]}
                      {participant.last_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${participant.first_name} ${participant.last_name}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Card>

        {/* Edit Modal */}
        <Modal open={editOpen} onClose={handleEditClose}>
          <Box sx={modalStyle} component="form" onSubmit={handleEditSubmit}>
            <Typography variant="h6" mb={3}>
              Edit Event
            </Typography>
            {editError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {typeof editError === 'string' ? editError : Object.entries(editError).map(([key, value]) => (
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
              value={editForm.title}
              onChange={handleEditChange}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={editForm.description}
              onChange={handleEditChange}
            />
            <TextField
              label="Location"
              name="location"
              fullWidth
              required
              margin="normal"
              value={editForm.location}
              onChange={handleEditChange}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              margin="normal"
              value={editForm.date}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              fullWidth
              required
              margin="normal"
              value={editForm.time}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={editLoading}
              >
                {editLoading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleEditClose}
                disabled={editLoading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Modal */}
        <Modal open={deleteOpen} onClose={handleDeleteClose}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Confirm Delete
            </Typography>
            <Typography mb={3}>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleDeleteClose}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Fade>
  );
};

export default EventDetails;