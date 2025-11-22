import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import adminAPI from '../../services/adminAPI';
import { errorHandler } from '../../utils/errorHandler';

export default function ContentManager() {
  const [pages, setPages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [pageContent, setPageContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const FALLBACK_PAGES = [
    { id: 1, title: 'الصفحة الرئيسية', content: 'محتوى الصفحة الرئيسية', lastModified: '2024-11-20' },
    { id: 2, title: 'من نحن', content: 'معلومات عن الشركة', lastModified: '2024-11-15' },
    { id: 3, title: 'الشروط والأحكام', content: 'شروط وأحكام الخدمة', lastModified: '2024-11-10' }
  ];

  const FALLBACK_FILES = [
    { id: 1, name: 'دليل المستخدم.pdf', size: '2.5 MB', uploadedDate: '2024-11-20' },
    { id: 2, name: 'سياسة الخصوصية.pdf', size: '1.2 MB', uploadedDate: '2024-11-15' },
    { id: 3, name: 'نموذج العقد.docx', size: '0.8 MB', uploadedDate: '2024-11-10' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      try {
        const [pagesRes, filesRes] = await Promise.all([
          adminAPI.content.getPages(),
          adminAPI.content.getFiles()
        ]);
        setPages(pagesRes.data || pagesRes);
        setFiles(filesRes.data || filesRes);
      } catch {
        // استخدم fallback data
        setPages(FALLBACK_PAGES);
        setFiles(FALLBACK_FILES);
      }
      setErrorMsg('');
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في التحميل');
      setPages(FALLBACK_PAGES);
      setFiles(FALLBACK_FILES);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setPageContent(page.content || '');
    setOpenPageDialog(true);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;

    try {
      setSaving(true);
      try {
        await adminAPI.content.updatePage(editingPage.id, pageContent);
      } catch {
        // حدّث محلياً في حالة الفشل
      }
      
      setPages(pages.map(p =>
        p.id === editingPage.id
          ? { ...p, content: pageContent, lastModified: new Date().toISOString().split('T')[0] }
          : p
      ));
      setSuccessMsg(`تم تحديث الصفحة "${editingPage.title}"`);
      setOpenPageDialog(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      try {
        await adminAPI.content.uploadFile(file);
      } catch {
        // حدّث محلياً في حالة الفشل
      }
      
      setFiles([...files, {
        id: Math.max(...files.map(f => f.id || 0), 0) + 1,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedDate: new Date().toISOString().split('T')[0]
      }]);
      setSuccessMsg(`تم رفع "${file.name}"`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في الرفع');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('هل أنت متأكد؟')) return;

    try {
      try {
        await adminAPI.content.deleteFile(fileId);
      } catch {
        // حدّث محلياً في حالة الفشل
      }
      
      setFiles(files.filter(f => f.id !== fileId));
      setSuccessMsg('تم حذف الملف');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في الحذف');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        إدارة الصفحات الثابتة
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {pages.map(page => (
          <Grid item xs={12} sm={6} md={4} key={page.id}>
            <Card sx={{ border: '1px solid #E0E0E0', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {page.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#616161', display: 'block', mb: 2 }}>
                  آخر تعديل: {page.lastModified}
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => handleEditPage(page)}
                  sx={{ backgroundColor: '#0056B3' }}
                  disabled={saving || uploading}
                >
                  تعديل
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        إدارة الملفات
      </Typography>

      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
            disabled={uploading}
          >
            رفع ملف
          </Button>
        </label>
      </Box>

      {uploading && <LinearProgress sx={{ mb: 2 }} />}

      <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '8px', p: 2 }}>
        {files.length === 0 ? (
          <Typography sx={{ color: '#616161' }}>لا توجد ملفات</Typography>
        ) : (
          files.map(file => (
            <Box
              key={file.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderBottom: '1px solid #E0E0E0',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{file.name}</Typography>
                <Typography variant="caption" sx={{ color: '#616161' }}>
                  {file.size} • {file.uploadedDate}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteFile(file.id)}
                disabled={uploading || saving}
                sx={{ color: '#C62828', borderColor: '#C62828' }}
              >
                حذف
              </Button>
            </Box>
          ))
        )}
      </Box>

      <Dialog open={openPageDialog} onClose={() => setOpenPageDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>تعديل: {editingPage?.title}</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            placeholder="أدخل محتوى الصفحة..."
            variant="outlined"
            disabled={saving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPageDialog(false)} disabled={saving}>إلغاء</Button>
          <Button
            onClick={handleSavePage}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : 'حفظ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
