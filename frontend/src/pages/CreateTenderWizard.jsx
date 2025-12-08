import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import TenderStepRenderer from '../components/TenderSteps/TenderStepRenderer';
import TenderFormLayout from '../components/TenderSteps/TenderFormLayout';

const CreateTenderWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    consultation_number: '',
    title: '',
    description: '',
    category: '',
    is_public: true,
    publication_date: '',
    deadline: '',
    opening_date: '',
    budget_min: 0,
    budget_max: 0,
    currency: 'TND',
    awardLevel: 'lot',
    lots: [],
    requirements: [],
    evaluation_criteria: {
      price: 0,
      quality: 0,
      delivery: 0,
      experience: 0
    },
    specification_documents: [],
    contact_person: '',
    contact_email: '',
    contact_phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExit, setShowExit] = useState(false);

  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('✅ CreateTenderWizard mounted successfully');
    }

    if (!formData) {
      console.error('❌ CreateTenderWizard: formData is undefined');
    }

    return () => {
      if (import.meta.env.DEV) {
        console.log('🔄 CreateTenderWizard unmounted');
      }
    };
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Add submission logic here
      console.log('Submitting tender:', formData);
      navigate('/buyer-dashboard');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      }>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Créer un Nouvel Appel d'Offre
            </Typography>
            <TenderFormLayout
              currentStep={currentStep}
              error={error}
              loading={loading}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              showExit={showExit}
              setShowExit={setShowExit}
              formData={formData}
              totalCriteria={
                Object.values(formData.evaluation_criteria || {}).reduce(
                  (sum, val) => sum + (Number(val) || 0),
                  0
                )
              }
              navigate={navigate}
            >
              <TenderStepRenderer
                currentStep={currentStep}
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                loading={loading}
                totalCriteria={
                  Object.values(formData.evaluation_criteria || {}).reduce(
                    (sum, val) => sum + (Number(val) || 0),
                    0
                  )
                }
              />
            </TenderFormLayout>
          </Paper>
        </Container>
      </Suspense>
    </ErrorBoundary>
  );
};

export default CreateTenderWizard;