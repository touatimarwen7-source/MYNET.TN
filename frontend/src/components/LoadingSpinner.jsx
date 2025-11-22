import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading Spinner Component
 * Displays centered loading animation with optional message
 */
export default function LoadingSpinner({ message = 'Chargement en cours...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '16px'
      }}
    >
      <CircularProgress sx={{ color: '#0056B3' }} size={50} />
      {message && (
        <Typography sx={{ color: '#616161', fontSize: '14px' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
