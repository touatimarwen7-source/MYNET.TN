import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { procurementAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ClarificationRequestsPage = () => {
  const [clarifications, setClarifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClarificationRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await procurementAPI.getClarificationRequests();
        setClarifications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch clarification requests.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'supplier') {
      fetchClarificationRequests();
    } else {
      setError('You do not have permission to access this page.');
      setLoading(false);
    }
  }, [user]);

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
      <Typography variant="h4" gutterBottom>
        طلبات التوضيح
      </Typography>
      {clarifications.length === 0 ? (
        <Alert severity="info">لا توجد طلبات توضيح.</Alert>
      ) : (
        <List>
          {clarifications.map((clarification) => (
            <ListItem key={clarification.id} divider>
              <ListItemText
                primary={`طلب توضيح للمناقصة: ${clarification.tender_title}`}
                secondary={`السؤال: ${clarification.question}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="view"
                  component={Link}
                  to={`/clarifications/${clarification.id}`}
                >
                  <VisibilityIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default ClarificationRequestsPage;
