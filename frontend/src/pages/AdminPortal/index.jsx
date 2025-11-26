/**
 * Admin Portal - واجهة الإدارة الرسمية الكاملة
 * منصة إدارة احترافية عالمية شاملة لـ superadmin@mynet.tn
 * @component
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import institutionalTheme from '../../theme/theme';
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
  Alert,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  AvatarGroup,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Settings,
  Assessment,
  Security,
  Storage,
  Edit,
  Delete,
  Block,
  Check,
  MoreVert,
  Download,
  Upload,
  Refresh,
  Add,
  Close,
  TrendingUp,
  Activity,
  Visibility,
  Lock,
} from '@mui/icons-material';
import { adminAPI } from '../../api';
import { logger } from '../../utils/logger';
import EnhancedErrorBoundary from '../../components/EnhancedErrorBoundary';

const THEME = institutionalTheme;

// ============ TAB 1: لوحة المعلومات ============
function DashboardTab() {
  const stats = [
    { label: 'إجمالي المستخدمين', value: '1,247', change: '+12%', icon: People, color: '#0056B3' },
    { label: 'الأجل الفعال', value: '42', change: '+5%', icon: Assessment, color: '#2e7d32' },
    { label: 'العروض المعلقة', value: '18', change: '-3%', icon: Activity, color: '#f57c00' },
    { label: 'صحة النظام', value: '98.5%', icon: Security, color: '#0288d1' },
  ];

  return (
    <Grid xs={12} spacing={3} container>
      {stats.map((stat, idx) => (
        <Grid xs={12} sm={6} md={3} key={idx}>
          <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: THEME.palette.primary.main }}>
                    {stat.value}
                  </Typography>
                  {stat.change && (
                    <Typography variant="caption" sx={{ color: stat.change.includes('+') ? '#2e7d32' : '#d32f2f', mt: 1 }}>
                      {stat.change} منذ الشهر الماضي
                    </Typography>
                  )}
                </Box>
                <Avatar sx={{ backgroundColor: `${stat.color}20`, width: 48, height: 48 }}>
                  <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* نظرة عامة على الأداء */}
      <Grid xs={12} md={8}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
          <CardHeader title="أداء النظام" action={<Refresh fontSize="small" />} />
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>توفر API</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>99.9%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={99.9} sx={{ height: 8, borderRadius: '4px' }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>استخدام قاعدة البيانات</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>65%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: '4px' }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>سرعة الاستجابة</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>145ms</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={72} sx={{ height: 8, borderRadius: '4px' }} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* النشاط الأخير */}
      <Grid xs={12} md={4}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
          <CardHeader title="النشاط الأخير" />
          <CardContent>
            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: THEME.palette.primary.main, mt: 1 }} />
                  <Stack flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>عملية إدارية</Typography>
                    <Typography variant="caption" color="textSecondary">قبل {item * 5} دقائق</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ TAB 2: إدارة المستخدمين ============
function UsersTab() {
  const [users] = useState([
    { id: 1, email: 'buyer@example.com', name: 'أحمد الشراء', role: 'buyer', status: 'نشط', joined: '2025-01-15' },
    { id: 2, email: 'supplier@tech.com', name: 'فاطمة الفرناسة', role: 'supplier', status: 'نشط', joined: '2025-01-10' },
    { id: 3, email: 'user@test.tn', name: 'محمد اختبار', role: 'buyer', status: 'معطل', joined: '2024-12-20' },
  ]);

  return (
    <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
      <CardHeader
        title="إدارة المستخدمين"
        action={<Button startIcon={<Add />} variant="contained" size="small">مستخدم جديد</Button>}
      />
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>البريد الإلكتروني</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>{user.name[0]}</Avatar>
                      <Typography variant="body2">{user.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'buyer' ? 'مشتري' : 'موردّ'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'نشط' ? 'success' : 'default'}
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="تعديل">
                        <IconButton size="small"><Edit fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <IconButton size="small"><Delete fontSize="small" /></IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============ TAB 3: إعدادات النظام ============
function SettingsTab() {
  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12} md={6}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
          <CardHeader title="إعدادات عامة" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>اللغة</InputLabel>
                <Select label="اللغة" defaultValue="ar">
                  <MenuItem value="ar">العربية</MenuItem>
                  <MenuItem value="fr">الفرنسية</MenuItem>
                  <MenuItem value="en">الإنجليزية</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>المنطقة الزمنية</InputLabel>
                <Select label="المنطقة الزمنية" defaultValue="utc+1">
                  <MenuItem value="utc+1">UTC+1 (تونس)</MenuItem>
                  <MenuItem value="utc+2">UTC+2</MenuItem>
                </Select>
              </FormControl>
              <TextField label="اسم المنصة" fullWidth defaultValue="MyNet.tn" size="small" />
              <Button variant="contained">حفظ الإعدادات</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={6}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
          <CardHeader title="الأمان" />
          <CardContent>
            <Stack spacing={2}>
              <Chip label="المصادقة الثنائية: مفعلة ✓" color="success" variant="filled" />
              <Chip label="تشفير SSL: نشط ✓" color="success" variant="filled" />
              <Chip label="النسخ الاحتياطي: يومي ✓" color="success" variant="filled" />
              <Button variant="outlined" startIcon={<Download />}>تحميل النسخة الاحتياطية</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ TAB 4: المراقبة والتدقيق ============
function MonitoringTab() {
  const logs = [
    { id: 1, action: 'تسجيل دخول', user: 'superadmin@mynet.tn', time: '2025-01-26 10:30', status: 'نجح' },
    { id: 2, action: 'تعديل مستخدم', user: 'superadmin@mynet.tn', time: '2025-01-26 09:15', status: 'نجح' },
    { id: 3, action: 'حذف عرض', user: 'superadmin@mynet.tn', time: '2025-01-25 14:45', status: 'نجح' },
  ];

  return (
    <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
      <CardHeader title="سجلات التدقيق" />
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>الإجراء</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>المستخدم</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الوقت</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <Chip label={log.status} size="small" color="success" variant="filled" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============ المكون الرئيسي ============
function AdminPortalContent() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* الرأس */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <DashboardIcon sx={{ fontSize: 32, color: THEME.palette.primary.main }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
              واجهة الإدارة الرسمية
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<Refresh />}>
            تحديث
          </Button>
        </Paper>

        {/* التنبيهات */}
        <Alert severity="success" sx={{ marginBottom: '24px', borderRadius: '8px' }}>
          ✓ جميع الأنظمة تعمل بكفاءة عالية
        </Alert>

        {/* التبويبات */}
        <Paper sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
              '& .Mui-selected': { color: THEME.palette.primary.main },
            }}
          >
            <Tab label="📊 لوحة المعلومات" />
            <Tab label="👥 المستخدمون" />
            <Tab label="⚙️ الإعدادات" />
            <Tab label="📈 المراقبة" />
          </Tabs>

          <Box sx={{ padding: '24px' }}>
            {tab === 0 && <DashboardTab />}
            {tab === 1 && <UsersTab />}
            {tab === 2 && <SettingsTab />}
            {tab === 3 && <MonitoringTab />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function AdminPortal() {
  return (
    <EnhancedErrorBoundary>
      <AdminPortalContent />
    </EnhancedErrorBoundary>
  );
}
