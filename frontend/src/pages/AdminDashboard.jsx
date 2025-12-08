
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import {
  People as UsersIcon,
  Gavel as TendersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';
import TokenManager from '../services/tokenManager';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setPageTitle('لوحة تحكم المساعد الإداري');
    const userData = TokenManager.getUser();
    setUser(userData);
    // في حالة وجود نظام صلاحيات، سيتم تحميلها من API
    setPermissions(userData?.permissions || ['view_users', 'view_reports']);
  }, []);

  const stats = [
    { label: 'المستخدمين', value: 342, icon: UsersIcon, color: '#0056B3' },
    { label: 'المناقصات النشطة', value: 67, icon: TendersIcon, color: '#2e7d32' },
    { label: 'التقارير اليوم', value: 12, icon: ReportsIcon, color: '#f57c00' },
    { label: 'الإشعارات', value: 28, icon: NotificationsIcon, color: '#1976d2' },
  ];

  const quickActions = [
    { 
      label: 'إدارة المستخدمين', 
      path: '/admin/users', 
      color: 'primary',
      permission: 'manage_users'
    },
    { 
      label: 'عرض التقارير', 
      path: '/admin/reports', 
      color: 'secondary',
      permission: 'view_reports'
    },
    { 
      label: 'إدارة المناقصات', 
      path: '/admin/tenders', 
      color: 'info',
      permission: 'manage_tenders'
    },
    { 
      label: 'الإعدادات', 
      path: '/admin/settings', 
      color: 'success',
      permission: 'manage_settings'
    },
  ];

  const hasPermission = (permission) => {
    return permissions.includes(permission) || permissions.includes('all');
  };

  const availableActions = quickActions.filter(action => 
    !action.permission || hasPermission(action.permission)
  );

  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">ليس لديك صلاحية الوصول إلى هذه الصفحة</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: institutionalTheme.palette.primary.main, 
            mb: 1 
          }}
        >
          لوحة تحكم المساعد الإداري
        </Typography>
        <Typography variant="body2" color="textSecondary">
          مرحباً {user.username || user.email} - إدارة النظام ومراقبة الأنشطة
        </Typography>
      </Box>

      {/* Permissions Notice */}
      {permissions.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          الصلاحيات المتاحة: {permissions.join('، ')}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card 
              sx={{ 
                border: '1px solid #E0E0E0', 
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon sx={{ fontSize: 28, color: stat.color }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ border: '1px solid #E0E0E0', boxShadow: 'none', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            إجراءات سريعة
          </Typography>
          {availableActions.length > 0 ? (
            <Grid container spacing={2}>
              {availableActions.map((action, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Button
                    fullWidth
                    variant="contained"
                    color={action.color}
                    onClick={() => navigate(action.path)}
                    sx={{ py: 1.5 }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="warning">
              لا توجد صلاحيات متاحة. يرجى التواصل مع المدير الأعلى.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card sx={{ border: '1px solid #E0E0E0', boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            النشاط الأخير
          </Typography>
          <Alert severity="info" sx={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
            سيتم عرض آخر الأنشطة والإشعارات هنا
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
}
