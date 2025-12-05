import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { procurementAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const ClarificationResponseForm = () => {
  const { clarificationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clarification, setClarification] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClarification = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await procurementAPI.getClarificationRequest(clarificationId);
        setClarification(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch clarification request.');
      } finally {
        setLoading(false);
      }
    };

    fetchClarification();
  }, [clarificationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await procurementAPI.respondToClarification(clarificationId, response);
      navigate('/clarifications'); // Redirect to the list after successful submission
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          الرد على طلب التوضيح
        </Typography>
        <Typography variant="body1">السؤال: {clarification?.question}</Typography>
        <TextField
          label="ردك"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'إرسال الرد'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClarificationResponseForm;
