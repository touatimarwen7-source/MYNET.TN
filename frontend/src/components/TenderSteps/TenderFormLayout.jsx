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

/**
 * Layout component for the multi-step tender creation form.
 * It handles the overall structure, header, progress, and navigation.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content of the current step.
 * @param {number} props.currentStep - The current active step index.
 * @param {string} props.error - The current error message.
 * @param {boolean} props.loading - The loading state.
 * @param {Function} props.handlePrevious - Function to go to the previous step.
 * @param {Function} props.handleNext - Function to go to the next step.
 * @param {Function} props.handleSubmit - Function to submit the form.
 * @param {boolean} props.showPreview - State for the preview dialog.
 * @param {Function} props.setShowPreview - Function to toggle the preview dialog.
 * @param {boolean} props.showExit - State for the exit dialog.
 * @param {Function} props.setShowExit - Function to toggle the exit dialog.
 * @param {object} props.formData - The form data for preview.
 * @param {number} props.totalCriteria - The total of evaluation criteria.
 * @param {Function} props.navigate - The navigate function from react-router-dom.
 * @returns {JSX.Element}
 */
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