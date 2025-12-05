import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

/**
 * Component to display a link to the tender evaluation page.
 * Appears only after the tender's opening date has passed.
 * @param {string} tenderId - The ID of the tender.
 */
const TenderEvaluationLink = ({ tenderId }) => {
  return (
    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AssessmentIcon />}
        component={Link}
        to={`/tenders/${tenderId}/evaluate`}
      >
        الانتقال إلى صفحة تقييم العروض
      </Button>
    </Box>
  );
};

export default TenderEvaluationLink;
