import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Divider, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useTheme } from '@mui/material/styles';
import axiosInstance from "../api/axiosInstance";

const ChatPage = () => {
  const theme = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('chatbot/conversations/');
      setConversations(response.data);
      if (response.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axiosInstance.get(`chatbot/conversations/${conversationId}/messages/`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    setLoading(true);
    const formData = new FormData();
    if (newMessage.trim()) {
      formData.append('message', newMessage);
    }
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axiosInstance.post('chatbot/chat/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      bgcolor: '#000000',
      color: '#ffffff',
      fontFamily: "'Roboto', sans-serif"
    }}>
      {/* Sidebar for Conversations */}
      <Box sx={{
        width: 300,
        bgcolor: '#1a1a1a',
        borderRight: '1px solid #333333',
        p: 2,
        overflowY: 'auto',
        transition: 'all 0.3s ease'
      }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: '#ffffff',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          Conversations
        </Typography>
        <List>
          {conversations.map((conv) => (
            <ListItem
              button
              key={conv.id}
              selected={selectedConversation === conv.id}
              onClick={() => handleConversationSelect(conv.id)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: selectedConversation === conv.id ? '#333333' : 'transparent',
                '&:hover': { bgcolor: '#2a2a2a' },
                transition: 'background-color 0.2s ease',
                color: '#ffffff'
              }}
            >
              <ListItemText
                primary={conv.title || `Conversation #${conv.id}`}
                secondary={new Date(conv.created_at).toLocaleDateString()}
                primaryTypographyProps={{ fontWeight: 400, fontSize: '0.95rem' }}
                secondaryTypographyProps={{ color: '#aaaaaa' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        bgcolor: '#000000'
      }}>
        <Paper sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 3,
          mb: 2,
          bgcolor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
        }}>
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ListItem sx={{
                  flexDirection: 'column',
                  alignItems: msg.user === 'self' ? 'flex-end' : 'flex-start',
                  mb: 1
                }}>
                  <Box sx={{
                    maxWidth: '60%',
                    bgcolor: msg.user === 'self' ? '#ffffff' : '#333333',
                    color: msg.user === 'self' ? '#000000' : '#ffffff',
                    p: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                      {msg.message}
                    </Typography>
                    {msg.file && (
                      <Typography
                        variant="caption"
                        component="a"
                        href={`/media/${msg.file}`}
                        target="_blank"
                        sx={{
                          color: '#aaaaaa',
                          textDecoration: 'underline',
                          '&:hover': { color: '#ffffff' }
                        }}
                      >
                        Attached File
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: '#aaaaaa', mt: 0.5, display: 'block' }}
                    >
                      {new Date(msg.created_at).toLocaleTimeString()} | Sentiment: {msg.sentiment}
                    </Typography>
                  </Box>
                  {msg.response && (
                    <Box sx={{
                      maxWidth: '60%',
                      bgcolor: '#333333',
                      color: '#ffffff',
                      p: 2,
                      borderRadius: 2,
                      mt: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                        {msg.response}
                      </Typography>
                    </Box>
                  )}
                </ListItem>
                <Divider sx={{ bgcolor: '#333333', my: 1 }} />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Paper>

        {/* Message Input */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#1a1a1a',
          p: 2,
          borderRadius: 2,
          border: '1px solid #333333'
        }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <IconButton
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
            sx={{
              color: '#ffffff',
              '&:hover': { bgcolor: '#333333' }
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            sx={{
              bgcolor: '#2a2a2a',
              borderRadius: 1,
              '& .MuiInputBase-input': {
                color: '#ffffff',
                fontSize: '0.95rem'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#333333'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff'
              }
            }}
          />
          <Button
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <SendIcon />}
            onClick={handleSendMessage}
            disabled={loading || (!newMessage.trim() && !file)}
            sx={{
              bgcolor: '#ffffff',
              color: '#000000',
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { bgcolor: '#e0e0e0' },
              '&:disabled': { bgcolor: '#666666', color: '#999999' }
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;