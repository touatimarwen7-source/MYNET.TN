
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import adminAPI from '../services/adminAPI';
import institutionalTheme from '../theme/theme';

export default function DynamicConfigManager() {
  const [currentTab, setCurrentTab] = useState(0);
  const [configs, setConfigs] = useState({});
  const [branding, setBranding] = useState({});
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.config.getAll();
      setConfigs(response.data || {});
      
      // Load branding
      setBranding({
        platformName: 'MyNet.tn',
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        logoUrl: '/logo.png'
      });
      
      // Load email templates
      setEmailTemplates([
        { id: 1, name: 'welcome_email', subject: 'Bienvenue', body: 'Bonjour {{name}}' },
        { id: 2, name: 'tender_notification', subject: 'Nouvel appel d\'offres', body: 'Nouveau tender disponible' }
      ]);
      
      // Load menus
      setMenus([
        { id: 1, title: 'Accueil', path: '/', icon: 'Home', visible: true },
        { id: 2, title: 'Appels d\'offres', path: '/tenders', icon: 'Gavel', visible: true },
        { id: 3, title: 'Tableau de bord', path: '/dashboard', icon: 'Dashboard', visible: true }
      ]);
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBranding = async () => {
    try {
      await adminAPI.config.update({ branding });
      setMessage('✅ Paramètres de marque sauvegardés');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleSaveEmailTemplate = async (template) => {
    try {
      setEmailTemplates(prev => 
        prev.map(t => t.id === template.id ? template : t)
      );
      setEditingTemplate(null);
      setMessage('✅ Modèle d\'email sauvegardé');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleToggleMenu = (menuId) => {
    setMenus(prev => 
      prev.map(menu => 
        menu.id === menuId ? { ...menu, visible: !menu.visible } : menu
      )
    );
  };

  const renderBrandingTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, color: institutionalTheme.palette.primary.main }}>
          <ColorLensIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Paramètres de la Marque
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de la plateforme"
              value={branding.platformName || ''}
              onChange={(e) => setBranding({ ...branding, platformName: e.target.value })}
              helperText="Affiché dans l'en-tête et le titre du site"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="URL du logo"
              value={branding.logoUrl || ''}
              onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
              helperText="Chemin vers le fichier logo"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Couleur Principale</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  type="color"
                  value={branding.primaryColor || '#1976d2'}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer' }}
                />
                <TextField
                  value={branding.primaryColor || '#1976d2'}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Couleur Secondaire</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  type="color"
                  value={branding.secondaryColor || '#dc004e'}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer' }}
                />
                <TextField
                  value={branding.secondaryColor || '#dc004e'}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveBranding}
              sx={{ backgroundColor: institutionalTheme.palette.primary.main }}
            >
              Sauvegarder les paramètres de marque
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderEmailTemplatesTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, color: institutionalTheme.palette.primary.main }}>
          <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Modèles d'Email
        </Typography>
        
        <List>
          {emailTemplates.map((template) => (
            <ListItem
              key={template.id}
              secondaryAction={
                <IconButton onClick={() => setEditingTemplate(template)}>
                  <EditIcon />
                </IconButton>
              }
              sx={{ borderBottom: '1px solid #E0E0E0' }}
            >
              <ListItemText
                primary={template.name}
                secondary={template.subject}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderMenuConfigTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, color: institutionalTheme.palette.primary.main }}>
          <MenuIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Configuration du Menu
        </Typography>
        
        <List>
          {menus.map((menu) => (
            <ListItem key={menu.id} sx={{ borderBottom: '1px solid #E0E0E0' }}>
              <ListItemText
                primary={menu.title}
                secondary={menu.path}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={menu.visible}
                    onChange={() => handleToggleMenu(menu.id)}
                  />
                }
                label={menu.visible ? 'Visible' : 'Masqué'}
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ backgroundColor: institutionalTheme.palette.primary.main }}
          >
            Sauvegarder la configuration du menu
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Gestion Dynamique de la Plateforme
      </Typography>

      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Tabs
        value={currentTab}
        onChange={(e, val) => setCurrentTab(val)}
        sx={{ mb: 3, borderBottom: '1px solid #E0E0E0' }}
      >
        <Tab label="Marque" />
        <Tab label="Emails" />
        <Tab label="Menus" />
      </Tabs>

      {currentTab === 0 && renderBrandingTab()}
      {currentTab === 1 && renderEmailTemplatesTab()}
      {currentTab === 2 && renderMenuConfigTab()}

      {/* Email Template Editor Dialog */}
      <Dialog
        open={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Modifier le modèle d'email</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Sujet"
              value={editingTemplate?.subject || ''}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Corps du message"
              value={editingTemplate?.body || ''}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
              multiline
              rows={10}
              helperText="Variables disponibles: {{name}}, {{email}}, {{platformName}}"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTemplate(null)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => handleSaveEmailTemplate(editingTemplate)}
            sx={{ backgroundColor: institutionalTheme.palette.primary.main }}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
