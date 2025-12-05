import React from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';

export default function FormStepper({
  title,
  steps = [],
  activeStep = 0,
  children,
  onNext = () => {},
  onPrevious = () => {},
  onSubmit = () => {},
  loading = false,
  error = null,
  onClearError = () => {},
  onBack = null,
}) {
  const isLast = activeStep >= steps.length - 1;

  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {onBack && (
          <Button variant="text" onClick={onBack}>
            Retour
          </Button>
        )}
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((s, idx) => (
          <Step key={s.name || idx}>
            <StepLabel>{s.name}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 3 }}>{children}</Box>

      {error && (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          <Typography variant="body2">{error}</Typography>
          <Button size="small" onClick={onClearError} sx={{ mt: 1 }}>
            Effacer
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button disabled={activeStep === 0 || loading} onClick={onPrevious}>
          Précédent
        </Button>
        {!isLast && (
          <Button variant="contained" onClick={onNext} disabled={loading}>
            Suivant
          </Button>
        )}
        {isLast && (
          <Button variant="contained" color="primary" onClick={onSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Soumettre'}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
