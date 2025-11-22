import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { procurementAPI } from '../api';

export default function TenderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tender, setTender] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setUser(tokenData);
      } catch (e) {
        console.error('Erreur lors du décodage du jeton:', e);
      }
    }
  }, []);

  useEffect(() => {
    fetchTender();
  }, [id]);

  const fetchTender = async () => {
    setLoading(true);
    try {
      const tenderRes = await procurementAPI.getTender(id);
      setTender(tenderRes.data.tender);
      
      try {
        const offersRes = await procurementAPI.getOffers(id);
        setOffers(offersRes.data.offers || []);
      } catch (err) {
        // Offers might not be accessible
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement de la marchandise');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#0056B3' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ paddingY: '40px' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!tender) {
    return (
      <Container maxWidth="lg" sx={{ paddingY: '40px' }}>
        <Alert severity="error">La marchandise n'existe pas</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px' }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{
            color: '#0056B3',
            textTransform: 'none',
            fontWeight: 500,
            marginBottom: '24px',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Retour
        </Button>

        {/* Header */}
        <Card sx={{ marginBottom: '32px', border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ padding: '32px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: '28px',
                    fontWeight: 500,
                    color: '#212121',
                    marginBottom: '16px',
                  }}
                >
                  {tender.title}
                </Typography>
                <Typography sx={{ color: '#616161', marginBottom: '12px' }}>
                  {tender.description}
                </Typography>
              </Box>
              <Chip
                label={tender.status === 'active' ? 'Actif' : 'Clôturé'}
                sx={{
                  backgroundColor: tender.status === 'active' ? '#e8f5e9' : '#ffebee',
                  color: tender.status === 'active' ? '#1b5e20' : '#c62828',
                  fontWeight: 600,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Details */}
        <Card sx={{ marginBottom: '32px', border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ padding: '32px' }}>
            <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '24px' }}>
              Détails de la marchandise
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '24px' }}>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Catégorie
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#212121', fontWeight: 500 }}>
                    {tender.category || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Budget
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#0056B3', fontWeight: 600 }}>
                    {tender.budget_min} - {tender.budget_max} {tender.currency}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Date limite
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#212121', fontWeight: 500 }}>
                    {new Date(tender.deadline).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Dernier mise à jour
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#212121', fontWeight: 500 }}>
                    {new Date(tender.updated_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Requirements */}
        {tender.requirements && tender.requirements.length > 0 && (
          <Card sx={{ marginBottom: '32px', border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ padding: '32px' }}>
              <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '16px' }}>
                Exigences
              </Typography>
              <Stack spacing={1}>
                {tender.requirements.map((req, idx) => (
                  <Typography key={idx} sx={{ fontSize: '14px', color: '#212121', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#0056B3', borderRadius: '50%', marginRight: '8px' }} />
                    {req}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Call to Action for Suppliers */}
        {user?.role === 'supplier' && tender.status === 'active' && (
          <Card sx={{ marginBottom: '32px', backgroundColor: '#e3f2fd', border: '1px solid #0056B3' }}>
            <CardContent sx={{ padding: '32px', textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 600, color: '#0d47a1', marginBottom: '12px' }}>
                Prêt à soumettre une offre?
              </Typography>
              <Typography sx={{ color: '#0056B3', marginBottom: '24px', fontSize: '14px' }}>
                Cliquez sur le bouton ci-dessous pour soumettre votre offre en toute sécurité
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`/create-offer/${id}`)}
                sx={{
                  backgroundColor: '#0056B3',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '12px 32px',
                  minHeight: '44px',
                  '&:hover': { backgroundColor: '#0d47a1' },
                }}
              >
                📝 Soumettre une Offre
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Offers List */}
        {offers.length > 0 && (
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ padding: 0 }}>
              <Box sx={{ padding: '24px' }}>
                <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 600, color: '#212121' }}>
                  Offres Reçues ({offers.length})
                </Typography>
              </Box>
              <Paper sx={{ border: '1px solid #e0e0e0', borderRadius: 0, overflow: 'hidden' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow sx={{ height: '56px' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#0056B3', textTransform: 'uppercase', fontSize: '12px' }}>
                        Fournisseur
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0056B3', textTransform: 'uppercase', fontSize: '12px' }} align="right">
                        Montant
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0056B3', textTransform: 'uppercase', fontSize: '12px' }}>
                        Délai
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0056B3', textTransform: 'uppercase', fontSize: '12px' }}>
                        Statut
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {offers.map(offer => (
                      <TableRow key={offer.id} sx={{ height: '56px', borderBottom: '1px solid #e0e0e0' }}>
                        <TableCell sx={{ color: '#212121', fontSize: '14px', fontWeight: 500 }}>
                          {offer.full_name}
                        </TableCell>
                        <TableCell sx={{ color: '#0056B3', fontSize: '14px', fontWeight: 600 }} align="right">
                          {offer.total_amount} {offer.currency}
                        </TableCell>
                        <TableCell sx={{ color: '#616161', fontSize: '14px' }}>
                          {offer.delivery_time}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={offer.status}
                            size="small"
                            sx={{
                              backgroundColor: offer.status === 'submitted' ? '#e3f2fd' : '#f5f5f5',
                              color: offer.status === 'submitted' ? '#0d47a1' : '#616161',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
