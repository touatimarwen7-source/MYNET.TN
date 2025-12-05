import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * A component to display a comparison table of submitted offers for a tender.
 * @param {Array} offers - The list of offer objects.
 * @param {string} tenderId - The ID of the tender.
 */
const OffersComparisonTable = ({ offers, tenderId }) => {
  const navigate = useNavigate();

  if (!offers || offers.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
        لم يتم تقديم أي عروض لهذه المناقصة بعد.
      </Typography>
    );
  }

  const handleEvaluateClick = (offerId) => {
    // Navigate to a detailed evaluation page for a single offer
    navigate(`/tenders/${tenderId}/evaluate/${offerId}`);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table aria-label="offers comparison table">
        <TableHead>
          <TableRow>
            <TableCell>المورد</TableCell>
            <TableCell align="right">المبلغ الإجمالي (مشفر)</TableCell>
            <TableCell align="center">الحالة</TableCell>
            <TableCell align="center">الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell component="th" scope="row">
                {offer.supplier_name || `المورد #${offer.supplier_id}`}
              </TableCell>
              <TableCell align="right">{offer.total_amount_encrypted || 'N/A'}</TableCell>
              <TableCell align="center">
                <Chip label={offer.status} color="primary" />
              </TableCell>
              <TableCell align="center">
                <Button variant="outlined" onClick={() => handleEvaluateClick(offer.id)}>
                  تقييم
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OffersComparisonTable;
