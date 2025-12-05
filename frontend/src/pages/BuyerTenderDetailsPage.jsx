import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Box, Chip } from '@mui/material';
import { procurementAPI } from '../api'; // Assuming procurementAPI is correctly imported from index.js
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth exists
import GroupIcon from '@mui/icons-material/Group';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TenderEvaluationLink from '../components/tenders/TenderEvaluationLink';

const BuyerTenderDetailsPage = () => {
  const { tenderId } = useParams();
  const { user } = useAuth(); // Assuming user object contains role
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // This API call is assumed to return 'offersCount' if the user is a buyer
        // and the opening_date has not passed, and 'offers' array otherwise.
        const response = await procurementAPI.getTender(tenderId);
        setTender(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tender details.');
      } finally {
        setLoading(false);
      }
    };

    if (tenderId && user?.role === 'buyer') {
      // Only fetch if user is a buyer
      fetchTenderDetails();
    } else if (user?.role !== 'buyer') {
      setError('You do not have permission to view this page.');
      setLoading(false);
    }
  }, [tenderId, user]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!tender) {
    return <Alert severity="info">No tender found.</Alert>;
  }

  const now = new Date();
  const openingDate = new Date(tender.opening_date);
  const canSeeOffers = now >= openingDate;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        تفاصيل المناقصة: {tender.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {tender.description}
      </Typography>
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        حالة العروض
      </Typography>
      {canSeeOffers ? (
        <Alert severity="success" icon={<LockOpenIcon />}>
          <Typography variant="body1">
            تاريخ فتح العروض قد حان. يمكنك الآن مراجعة العروض المقدمة.
            {/* Link to Tender Evaluation page would go here */}
          </Typography>
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<GroupIcon />}
            label={`عدد المشاركين: ${tender.offersCount || 0}`}
            color="info"
            variant="outlined"
            sx={{ fontSize: '1.1rem', p: 1 }}
          />
          <Chip
            icon={<LockOpenIcon />}
            label={`تاريخ فتح العروض: ${openingDate.toLocaleString()}`}
            color="warning"
            variant="outlined"
            sx={{ fontSize: '1.1rem', p: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            لا يمكن رؤية تفاصيل العروض قبل تاريخ الفتح.
          </Typography>
        </Box>
      )}
      {canSeeOffers && <TenderEvaluationLink tenderId={tenderId} />}

      {/* Other tender details can be displayed here */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">تفاصيل المناقصة الأخرى:</Typography>
        <Typography variant="body2">
          الموعد النهائي: {new Date(tender.deadline).toLocaleString()}
        </Typography>
        <Typography variant="body2">الحالة: {tender.status}</Typography>
        {/* ... more tender details */}
      </Box>
    </Container>
  );
};

export default BuyerTenderDetailsPage;
