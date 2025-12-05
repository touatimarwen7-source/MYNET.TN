import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useBidForm } from '../../hooks/useBidForm';
import SecureBidForm from '../components/bids/SecureBidForm';

const SubmitBidPage = () => {
  const { tender, loading, errors } = useBidForm();

  if (loading) {
    return <CircularProgress />;
  }

  if (errors.general) {
    return <Alert severity="error">{errors.general}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Soumettre une Offre pour: {tender?.title}
      </Typography>
      <SecureBidForm />
    </Container>
  );
};

export default SubmitBidPage;
