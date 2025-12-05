import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { procurementAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ClarificationRequestModal from '../components/evaluation/ClarificationRequestModal'; //Corrected import path

/**
 * Page for a buyer to perform a detailed evaluation of a single offer.
 */
const DetailedOfferEvaluationPage = () => {
  const { tenderId, offerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (user?.role !== 'buyer') {
        setError('Permission Denied: Only buyers can evaluate offers.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // The backend should perform decryption here before sending the data
        const response = await procurementAPI.getOffer(offerId);
        setOffer(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch offer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, [offerId, user]);

  const handleAction = async (action) => {
    setActionInProgress(true);
    try {
      if (action === 'accept') {
        await procurementAPI.selectWinner(offerId);
        navigate(`/tenders/${tenderId}/evaluate`);
      } else if (action === 'reject') {
        await procurementAPI.rejectOffer(offerId);
        navigate(`/tenders/${tenderId}/evaluate`);
      }
      // Add logic for 'clarification' if needed
    } catch (err) {
      setError(`Failed to ${action} offer.`);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleSendClarification = async (question) => {
    setActionInProgress(true);
    try {
      await procurementAPI.requestClarification(offerId, question);
      // Optionally, show a success snackbar
      setIsModalOpen(false);
    } catch (err) {
      // Optionally, show an error snackbar
      setError(`Failed to send clarification request.`);
    } finally {
      setActionInProgress(false);
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

  if (!offer) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Offer not found.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          تقييم العرض من: {offer.supplier_name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          للمناقصة: {offer.tender_title || `Tender ID: ${tenderId}`}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          {/* Offer Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              تفاصيل العرض
            </Typography>
            <Typography>
              <b>الحالة:</b> <Chip label={offer.status} color="info" />
            </Typography>
            <Typography>
              <b>فترة الصلاحية:</b> {offer.validity_period} يوم
            </Typography>
            <Typography>
              <b>شروط الدفع:</b> {offer.payment_terms}
            </Typography>
          </Grid>

          {/* Supplier Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              معلومات المورد
            </Typography>
            <Typography>
              <b>جهة الاتصال:</b> {offer.supplier_contact_person}
            </Typography>
            <Typography>
              <b>البريد الإلكتروني:</b> {offer.supplier_email}
            </Typography>
            <Typography>
              <b>الهاتف:</b> {offer.supplier_phone}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Line Items */}
        <Typography variant="h6" gutterBottom>
          البنود المقدمة
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>البند</TableCell>
                <TableCell align="right">الكمية</TableCell>
                <TableCell align="right">السعر الوحدوي (مفكوك التشفير)</TableCell>
                <TableCell align="right">الإجمالي</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offer.line_items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.unit_price} TND</TableCell>
                  <TableCell align="right">
                    {(item.quantity * item.unit_price).toFixed(2)} TND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<HelpOutlineIcon />}
            disabled={actionInProgress}
            onClick={() => setIsModalOpen(true)}
          >
            طلب توضيح
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleAction('reject')}
            disabled={actionInProgress}
          >
            رفض العرض
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleAction('accept')}
            disabled={actionInProgress}
          >
            قبول وترسية العرض
          </Button>
        </Box>
        <ClarificationRequestModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendClarification}
          isSending={actionInProgress}
        />
      </Paper>
    </Container>
  );
};

export default DetailedOfferEvaluationPage;
