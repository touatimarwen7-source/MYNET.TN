import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Lock, Timer, CheckCircle } from '@mui/icons-material';

const SecurityStatusBar = ({ deadline, eligibility, onDeadlinePass }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(deadline) - new Date();
      if (remaining <= 0) {
        setTimeLeft('Clôturé');
        setIsClosed(true);
        if (onDeadlinePass) onDeadlinePass();
        clearInterval(interval);
        return;
      }
      // Format remaining time (days, hours, minutes, seconds)
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onDeadlinePass]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 1,
        mb: 3,
        alignItems: 'center',
      }}
    >
      <Chip
        icon={<Timer />}
        label={`Temps restant: ${timeLeft}`}
        color={isClosed ? 'error' : 'primary'}
      />
      <Chip icon={<Lock />} label="Chiffrement: Actif" color="success" variant="outlined" />
      <Chip
        icon={<CheckCircle />}
        label={eligibility ? 'Éligible' : 'Non Éligible'}
        color={eligibility ? 'success' : 'warning'}
      />
    </Box>
  );
};

export default SecurityStatusBar;
