import React from 'react';
import { Box, Button, Paper, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { useBidForm } from '../../hooks/useBidForm';
import SecurityStatusBar from '../bids/SecurityStatusBar';
import LineItemResponseTable from '../bids/LineItemResponseTable';

const SecureBidForm = () => {
  const { tender, bidData, submitting, errors, handleSubmit, handleInputChange } = useBidForm();
  const [commitmentChecked, setCommitmentChecked] = React.useState(false);
  const [deadlinePassed, setDeadlinePassed] = React.useState(false);

  if (!tender) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* 1. Security and Status Bar */}
        <SecurityStatusBar
          deadline={tender.deadline}
          eligibility={true}
          onDeadlinePass={() => setDeadlinePassed(true)}
        />

        {/* 2. Core Bid Data (Simplified for this example) */}
        {/* Fields like supplierReference, validityPeriod, etc. would go here */}

        {/* 3. Line Item Response Table */}
        <LineItemResponseTable tenderItems={tender.items} />

        {/* 4. Final Review and Secure Submission */}
        <Box sx={{ mt: 4, textAlign: 'right' }}>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {errors.general}
            </Alert>
          )}
          {deadlinePassed && (
            <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
              Le délai de soumission pour cet appel d'offres est terminé.
            </Alert>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={commitmentChecked}
                onChange={(e) => setCommitmentChecked(e.target.checked)}
                name="commitmentCheck"
                color="primary"
              />
            }
            label="Je confirme avoir lu et compris toutes les conditions."
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !commitmentChecked || deadlinePassed}
          >
            {submitting ? 'Chiffrement et envoi...' : "Chiffrer et Envoyer l'Offre"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SecureBidForm;
