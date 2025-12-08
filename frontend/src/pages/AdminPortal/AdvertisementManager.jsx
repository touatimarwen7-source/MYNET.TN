
import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, TrendingUp } from '@mui/icons-material';
import institutionalTheme from '../../theme/theme';
import api from '../../services/api';

const THEME = institutionalTheme;

export default function AdvertisementManager() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    cta_text: '',
    ad_type: 'banner',
    placement: 'homepage',
    start_date: '',
    end_date: '',
    priority: 0,
    is_active: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/advertisements');
      setAds(response.data.data || []);
    } catch (error) {
      setMessage('Erreur lors du chargement des publicités');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description || '',
        image_url: ad.image_url || '',
        link_url: ad.link_url || '',
        cta_text: ad.cta_text || '',
        ad_type: ad.ad_type,
        placement: ad.placement,
        start_date: ad.start_date ? new Date(ad.start_date).toISOString().split('T')[0] : '',
        end_date: ad.end_date ? new Date(ad.end_date).toISOString().split('T')[0] : '',
        priority: ad.priority,
        is_active: ad.is_active
      });
    } else {
      setEditingAd(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        cta_text: '',
        ad_type: 'banner',
        placement: 'homepage',
        start_date: '',
        end_date: '',
        priority: 0,
        is_active: true
      });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingAd) {
        await api.put(`/admin/advertisements/${editingAd.id}`, formData);
        setMessage('Publicité mise à jour avec succès');
      } else {
        await api.post('/admin/advertisements', formData);
        setMessage('Publicité créée avec succès');
      }
      setOpenDialog(false);
      fetchAds();
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      try {
        await api.delete(`/admin/advertisements/${id}`);
        setMessage('Publicité supprimée avec succès');
        fetchAds();
      } catch (error) {
        setMessage('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleActive = async (ad) => {
    try {
      await api.put(`/admin/advertisements/${ad.id}`, {
        is_active: !ad.is_active
      });
      setMessage('Statut mis à jour');
      fetchAds();
    } catch (error) {
      setMessage('Erreur lors de la mise à jour');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
              Gestion des Publicités
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ backgroundColor: THEME.palette.primary.main }}
            >
              Nouvelle Publicité
            </Button>
          </Stack>

          {message && (
            <Alert severity={message.includes('Erreur') ? 'error' : 'success'} onClose={() => setMessage('')}>
              {message}
            </Alert>
          )}

          {loading && <LinearProgress />}

          {/* Ads Grid */}
          <Grid container spacing={3}>
            {ads.map((ad) => (
              <Grid item xs={12} md={6} lg={4} key={ad.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {ad.image_url && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={ad.image_url}
                      alt={ad.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flex: 1 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
                          <Chip
                            label={ad.ad_type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={ad.placement}
                            size="small"
                            variant="outlined"
                          />
                          {ad.is_active && (
                            <Chip
                              label="Actif"
                              size="small"
                              color="success"
                            />
                          )}
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {ad.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                          {ad.description}
                        </Typography>
                      </Box>

                      {/* Stats */}
                      <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Impressions
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {ad.impression_count || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Clics
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {ad.click_count || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              CTR
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {ad.impression_count > 0
                                ? ((ad.click_count / ad.impression_count) * 100).toFixed(1)
                                : 0}%
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Actions */}
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleOpenDialog(ad)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color={ad.is_active ? 'warning' : 'success'}
                          onClick={() => handleToggleActive(ad)}
                        >
                          {ad.is_active ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(ad.id)}
                        >
                          Supprimer
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAd ? 'Modifier la publicité' : 'Nouvelle publicité'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ paddingTop: 2 }}>
              <TextField
                fullWidth
                label="Titre"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                fullWidth
                label="URL de l'image"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <TextField
                fullWidth
                label="URL du lien"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              />
              <TextField
                fullWidth
                label="Texte du bouton CTA"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Type de publicité</InputLabel>
                <Select
                  value={formData.ad_type}
                  onChange={(e) => setFormData({ ...formData, ad_type: e.target.value })}
                >
                  <MenuItem value="banner">Bannière</MenuItem>
                  <MenuItem value="popup">Pop-up</MenuItem>
                  <MenuItem value="sidebar">Barre latérale</MenuItem>
                  <MenuItem value="inline">Intégré</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Emplacement</InputLabel>
                <Select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                >
                  <MenuItem value="homepage">Page d'accueil</MenuItem>
                  <MenuItem value="dashboard">Tableau de bord</MenuItem>
                  <MenuItem value="tenders">Liste des appels d'offres</MenuItem>
                  <MenuItem value="sidebar">Barre latérale</MenuItem>
                </Select>
              </FormControl>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date de début"
                    InputLabelProps={{ shrink: true }}
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date de fin"
                    InputLabelProps={{ shrink: true }}
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                type="number"
                label="Priorité (0-100)"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="Actif"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{ backgroundColor: THEME.palette.primary.main }}
            >
              {editingAd ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
