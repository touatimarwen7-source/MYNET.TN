
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import axiosInstance from '../services/axiosConfig';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeBids: 0,
      wonContracts: 0,
      totalRevenue: 0,
      pendingOffers: 0,
    },
    recentTenders: [],
    recentOffers: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ SAFE API CALLS with error handling
      const [statsRes, tendersRes, offersRes] = await Promise.allSettled([
        axiosInstance.get('/api/supplier-analytics/performance').catch(() => ({ data: { stats: {} } })),
        axiosInstance.get('/api/procurement/tenders?limit=5').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/api/procurement/offers/my-offers?limit=5').catch(() => ({ data: { data: [] } })),
      ]);

      // ✅ SAFE DATA EXTRACTION
      const stats = statsRes.status === 'fulfilled' ? statsRes.value?.data?.stats || {} : {};
      const tenders = tendersRes.status === 'fulfilled' ? tendersRes.value?.data?.data || [] : [];
      const offers = offersRes.status === 'fulfilled' ? offersRes.value?.data?.data || [] : [];

      setDashboardData({
        stats: {
          activeBids: stats.activeBids || 0,
          wonContracts: stats.wonContracts || 0,
          totalRevenue: stats.totalRevenue || 0,
          pendingOffers: stats.pendingOffers || 0,
        },
        recentTenders: Array.isArray(tenders) ? tenders : [],
        recentOffers: Array.isArray(offers) ? offers : [],
      });
    } catch (err) {
      console.error('❌ Dashboard Error:', err);
      setError(err.message || 'فشل تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>جاري تحميل البيانات...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          إعادة المحاولة
        </Button>
      </Container>
    );
  }

  const { stats, recentTenders, recentOffers } = dashboardData;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        لوحة تحكم المورد
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.activeBids}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    عروض نشطة
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.wonContracts}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    عقود مكتسبة
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AttachMoneyIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {new Intl.NumberFormat('ar-TN', {
                      style: 'currency',
                      currency: 'TND',
                      minimumFractionDigits: 0,
                    }).format(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي الإيرادات
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.pendingOffers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    عروض قيد الانتظار
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Tenders */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            أحدث العطاءات المتاحة
          </Typography>
          {recentTenders.length > 0 ? (
            <Box>
              {recentTenders.map((tender) => (
                <Box
                  key={tender.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid #E0E0E0',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#F5F5F5' },
                  }}
                  onClick={() => navigate(`/tender/${tender.id}`)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {tender.title || 'عطاء بدون عنوان'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الموعد النهائي: {new Date(tender.closing_date).toLocaleDateString('ar-TN')}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              لا توجد عطاءات متاحة حاليًا
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Recent Offers */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            عروضي الأخيرة
          </Typography>
          {recentOffers.length > 0 ? (
            <Box>
              {recentOffers.map((offer) => (
                <Box
                  key={offer.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid #E0E0E0',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    عرض #{offer.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الحالة: {offer.status || 'غير محدد'}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              لم تقدم أي عروض بعد
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default SupplierDashboard;
