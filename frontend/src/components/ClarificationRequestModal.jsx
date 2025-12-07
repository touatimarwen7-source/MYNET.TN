
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { procurementAPI } from '../api';

export default function ClarificationRequestModal({ open, onClose, offerId, tenderTitle }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('الرجاء إدخال سؤال');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await procurementAPI.requestClarification(offerId, question);
      setQuestion('');
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">طلب توضيح</Typography>
          <IconButton onClick={() => onClose(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {tenderTitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {tenderTitle}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="سؤالك"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="اكتب سؤالك هنا..."
          disabled={loading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          إلغاء
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'جارٍ الإرسال...' : 'إرسال'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
