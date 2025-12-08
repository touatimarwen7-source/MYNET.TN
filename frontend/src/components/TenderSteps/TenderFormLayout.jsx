import React from 'react';
import institutionalTheme from '../../theme/theme';
import {
  Container,
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PublishIcon from '@mui/icons-material/Publish';

// Définition des étapes du processus
const steps = [
  'Informations de Base',
  'Calendrier',
  'Lots',
  'Exigences',
  'Évaluation',
  'Documents',
  'Révision',
];

const TenderFormLayout = ({
  currentStep,
  error,
  loading,
  handlePrevious,
  handleNext,
  handleSubmit,
  children,
}) => {
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Box sx={{ backgroundColor: '#fafafa', py: 5, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: '8px' }}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: institutionalTheme.palette.primary.main,
              textAlign: 'center',
            }}
          >
            إنشاء مناقصة جديدة
          </Typography>

          {/* 2. إضافة مكون Stepper لعرض شريط التقدم */}
          <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* عرض رسائل الخطأ */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 3. عرض محتوى الخطوة الحالية */}
          <Box sx={{ my: 4 }}>{children}</Box>

          {/* 4. أزرار التنقل */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              pt: 2,
              borderTop: '1px solid #eee',
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handlePrevious}
              disabled={currentStep === 0 || loading}
            >
              السابق
            </Button>

            {isLastStep ? (
              <Button
                variant="contained"
                color="success"
                endIcon={<PublishIcon />}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'نشر المناقصة'}
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                disabled={loading}
                sx={{ backgroundColor: institutionalTheme.palette.primary.main }}
              >
                التالي
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TenderFormLayout;