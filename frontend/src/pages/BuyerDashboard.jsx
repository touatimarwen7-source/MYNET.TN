/**
 * لوحة تحكم المشتري - Buyer Dashboard
 * واجهة احترافية عالمية للمشترين مع أفضل الممارسات
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Grid, Button, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, CircularProgress, Chip, Stack, Paper, List,
  ListItemButton, ListItemIcon, ListItemText, Divider, Drawer, Avatar,
  LinearProgress, Card, CardContent, Badge
} from '@mui/material';
import {
  Dashboard, Assignment, Money, LocalShipping, People, Notifications,
  Person, Settings, Security, Visibility, TrendingUp, TrendingDown,
  CheckCircle, Schedule, Warning, MoreVert, ArrowUpward, ArrowDownward
} from '@mui/icons-material';
import { procurementAPI } from '../api';
import { logger } from '../utils/logger';
import EnhancedErrorBoundary from '../components/EnhancedErrorBoundary';
import institutionalTheme from '../theme/theme';

const DRAWER_WIDTH = 280;

function BuyerDashboardContent() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tendersRes, offersRes] = await Promise.all([
        procurementAPI.getMyTenders({ limit: 10 }),
        procurementAPI.getMyOffers()
      ]);
      setTenders(tendersRes?.data?.tenders || []);
      setOffers(offersRes?.data?.offers || []);
    } catch (err) {
      logger.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Dashboard },
    { id: 'tenders', label: 'الأجل النشطة', icon: Assignment },
    { id: 'create-tender', label: 'إنشاء أجل جديدة', icon: Assignment },
    { id: 'monitoring', label: 'المراقبة والتقييم', icon: Visibility },
    { id: 'finances', label: 'الفواتير والميزانيات', icon: Money },
    { id: 'operations', label: 'العمليات والعقود', icon: LocalShipping },
    { id: 'team', label: 'إدارة الفريق', icon: People },
    { id: 'notifications', label: 'الإخطارات', icon: Notifications },
    { id: 'profile', label: 'الملف الشخصي', icon: Person },
    { id: 'security', label: 'الأمان والخصوصية', icon: Security },
  ];

  const activeTenders = tenders.filter(t => t.status === 'open').length;
  const submittedOffers = offers.filter(o => o.status === 'submitted').length;

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card sx={{
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `1px solid ${color}30`,
      borderRadius: '12px',
      p: 3,
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 24px ${color}20` }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mt: 1 }}>{value}</Typography>
        </Box>
        <Avatar sx={{ background: color, color: 'white', width: 50, height: 50 }}>
          <Icon />
        </Avatar>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {change > 0 ? <ArrowUpward sx={{ color: '#2e7d32', fontSize: 18 }} /> : <ArrowDownward sx={{ color: '#D32F2F', fontSize: 18 }} />}
        <Typography variant="caption" sx={{ color: change > 0 ? '#2e7d32' : '#D32F2F', fontWeight: 600 }}>
          {change > 0 ? '+' : ''}{change}%
        </Typography>
        <Typography variant="caption" sx={{ color: '#999' }}>من الشهر الماضي</Typography>
      </Box>
    </Card>
  );

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>لوحة التحكم</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>مرحباً بك في منصة المناقصات المتقدمة</Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="الأجل النشطة" value={activeTenders} change={12} icon={Assignment} color="#0056B3" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="متوسط الادخار" value="18.5%" change={5} icon={TrendingDown} color="#2e7d32" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="العروض المنتظرة" value={submittedOffers} change={-3} icon={Schedule} color="#f57c00" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="معدل الإغلاق" value="92%" change={8} icon={CheckCircle} color="#0288d1" />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>أحدث المناقصات</Typography>
                  <Button size="small" onClick={() => navigate('/buyer-active-tenders')} sx={{ textTransform: 'none' }}>
                    عرض الكل →
                  </Button>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600 }}>المناقصة</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>الميزانية</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>الموعد</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}><CircularProgress size={30} /></TableCell></TableRow>
                      ) : tenders.length === 0 ? (
                        <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: '#999' }}>لا توجد مناقصات</TableCell></TableRow>
                      ) : (
                        tenders.slice(0, 5).map((tender) => (
                          <TableRow key={tender.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/tender/${tender.id}`)}>
                            <TableCell sx={{ fontWeight: 500 }}>{tender.title || 'مناقصة'}</TableCell>
                            <TableCell>د.ت {tender.budget_max || 0}</TableCell>
                            <TableCell>{new Date(tender.created_at).toLocaleDateString('ar-TN')}</TableCell>
                            <TableCell>
                              <Chip
                                label={tender.status === 'open' ? 'نشطة' : 'مغلقة'}
                                size="small"
                                color={tender.status === 'open' ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0', background: 'linear-gradient(135deg, #0056B3 0%, #003d82 100%)', color: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>إنشاء مناقصة جديدة</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>ابدأ عملية مناقصة جديدة بسهولة</Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                    onClick={() => navigate('/create-tender')}
                  >
                    + إنشاء أجل
                  </Button>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>إجراءات سريعة</Typography>
                  <Stack spacing={1}>
                    <Button fullWidth variant="text" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                      <Visibility sx={{ mr: 1 }} /> عرض جميع الأجل
                    </Button>
                    <Button fullWidth variant="text" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                      <Visibility sx={{ mr: 1 }} /> المراقبة والتقييم
                    </Button>
                    <Button fullWidth variant="text" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                      <Money sx={{ mr: 1 }} /> الفواتير
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      );
    }

    return (
      <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0', textAlign: 'center', py: 6 }}>
        <Typography variant="body1" sx={{ color: '#999' }}>اختر قسماً من القائمة الجانبية</Typography>
      </Paper>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', background: 'linear-gradient(135deg, #0056B3 0%, #003d82 100%)', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>🎯 لوحتي</Typography>
      </Box>
      <List sx={{ flex: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            sx={{
              borderRight: activeSection === item.id ? '4px solid #0056B3' : 'none',
              backgroundColor: activeSection === item.id ? '#f0f4ff' : 'transparent',
              color: activeSection === item.id ? '#0056B3' : 'inherit',
              fontWeight: activeSection === item.id ? 600 : 400,
              '&:hover': { backgroundColor: '#f0f4ff', color: '#0056B3' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.id ? '#0056B3' : 'inherit' }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            mt: '64px',
            height: 'calc(100vh - 64px)',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #e0e0e0'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default function BuyerDashboard() {
  return (
    <EnhancedErrorBoundary>
      <BuyerDashboardContent />
    </EnhancedErrorBoundary>
  );
}
