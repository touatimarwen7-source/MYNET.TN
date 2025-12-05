import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { procurementAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import OffersComparisonTable from '../components/evaluation/OffersComparisonTable';

/**
 * Page for buyers to evaluate all offers submitted for a specific tender.
 * This page should only be accessible after the tender's opening date.
 */
const TenderEvaluationPage = () => {
  const { tenderId } = useParams();
  const { user } = useAuth();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderForEvaluation = async () => {
      setLoading(true);
      setError(null);
      try {
        // The backend ensures that 'offers' are only returned if the opening date has passed.
        const response = await procurementAPI.getTender(tenderId);
        setTender(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tender details for evaluation.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'buyer') {
      fetchTenderForEvaluation();
    } else {
      setError('You do not have permission to access this page.');
      setLoading(false);
    }
  }, [tenderId, user]);

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

  if (!tender) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Tender not found.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        تقييم العروض للمناقصة: {tender.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        رقم المناقصة: {tender.tender_number}
      </Typography>
      <OffersComparisonTable offers={tender.offers} tenderId={tender.id} />
    </Container>
  );
};

export default TenderEvaluationPage;
