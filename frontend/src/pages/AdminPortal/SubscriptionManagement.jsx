/**
 * Subscription Management - إدارة خطط الاشتراك
 * إدارة متقدمة للخطط والاشتراكات
 */

import { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Stack,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Check } from '@mui/icons-material';
import institutionalTheme from '../../theme/theme';

const THEME = institutionalTheme;

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'TND',
    duration_days: 30,
    max_tenders: 10,
    max_offers: 50,
    max_products: 50,
    storage_limit: 5,
    features: {}
  });

  useEffect(() => {
    fetchPlans();
    fetchAnalytics();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/subscriptions/plans');
      setPlans(response.data.data || []);
    } catch (error) {
      setMessage('Erreur lors du chargement des plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/subscriptions/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency || 'TND',
        duration_days: plan.duration_days,
        max_tenders: plan.max_tenders,
        max_offers: plan.max_offers,
        max_products: plan.max_products || 50,
        storage_limit: plan.storage_limit || 5,
        features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || {}
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        currency: 'TND',
        duration_days: 30,
        max_tenders: 10,
        max_offers: 50,
        max_products: 50,
        storage_limit: 5,
        features: {}
      });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingPlan) {
        await api.put(`/admin/subscriptions/plans/${editingPlan.id}`, formData);
        setMessage('Plan mis à jour avec succès');
      } else {
        await api.post('/admin/subscriptions/plans', formData);
        setMessage('Plan créé avec succès');
      }
      setOpenDialog(false);
      fetchPlans();
      fetchAnalytics();
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      try {
        await api.delete(`/admin/subscriptions/plans/${id}`);
        setMessage('Plan supprimé avec succès');
        fetchPlans();
      } catch (error) {
        setMessage(error.response?.data?.error || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* الرأس */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
              إدارة خطط الاشتراك
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              خطة جديدة
            </Button>
          </Stack>

          {/* الخطط المتاحة */}
          <Grid xs={12} spacing={3} container>
            {plans.map((plan) => (
              <Grid xs={12} md={4} key={plan.id}>
                <Card
                  sx={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #0056B3',
                    borderRadius: '12px',
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ color: THEME.palette.primary.main, fontWeight: 700 }}
                      >
                        د.ت {plan.price}
                        <Typography component="span" variant="body2" sx={{ fontWeight: 400 }}>
                          {' '}
                          / شهر
                        </Typography>
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">👥 {plan.users} مستخدم</Typography>
                        <Typography variant="body2">📋 {plan.offers} أجل</Typography>
                        <Typography variant="body2">✨ {plan.features} ميزة</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" startIcon={<Edit />}>
                          تعديل
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                        >
                          حذف
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* الاشتراكات النشطة */}
          <Card
            sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          >
            <CardHeader title="الاشتراكات النشطة" />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>الشركة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الخطة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>المستخدمون النشطون</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>تاريخ التجديد</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.company}</TableCell>
                        <TableCell>
                          <Chip label={sub.plan} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{sub.active_users}</TableCell>
                        <TableCell>{sub.renewal_date}</TableCell>
                        <TableCell>
                          <Button size="small">تفاصيل</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
