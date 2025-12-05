import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Lock, ErrorOutline } from '@mui/icons-material';
import { useBidForm } from '../../hooks/useBidForm';

const LineItemResponseTable = ({ tenderItems }) => {
  const { bidData, handleLineItemChange, errors } = useBidForm();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description du Lot</TableCell>
            <TableCell align="right">Quantité</TableCell>
            <TableCell align="right">Prix Unitaire (TND)</TableCell>
            <TableCell align="right">Délai de livraison (jours)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tenderItems.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell align="right">
                <TextField
                  variant="outlined"
                  type="number"
                  size="small"
                  value={bidData.lineItemResponses[index]?.unitPrice || ''}
                  onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: errors.lineItemResponses?.[index]?.unitPrice && (
                      <InputAdornment position="end">
                        <ErrorOutline color="error" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.lineItemResponses?.[index]?.unitPrice}
                  helperText={errors.lineItemResponses?.[index]?.unitPrice}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  size="small"
                  value={bidData.lineItemResponses[index]?.deliveryTime || ''}
                  onChange={(e) => handleLineItemChange(index, 'deliveryTime', e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LineItemResponseTable;
