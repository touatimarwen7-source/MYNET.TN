import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import institutionalTheme from '../theme/theme';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Breadcrumbs,
  Link,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TableSkeleton, CardSkeleton } from '../components/SkeletonLoader';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';
import { getScoreTier, formatScore } from '../utils/evaluationCriteria';

export default function OfferAnalysis() {
  const theme = institutionalTheme;
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offers, setOffers] = useState([]);
  const [tender, setTender] = useState(null);
  const [analysis, setAnalysis] = useState({
    avgPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    totalOffers: 0,
  });
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setPageTitle('Analyse des Offres');
    fetchOffers();
  }, [tenderId]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');

      const tenderRes = await procurementAPI.getTender(tenderId);
      const offersRes = await procurementAPI.getOffers(tenderId);
      
      // Handle sealed offers response
      if (offersRes.data.is_sealed) {
        setTender(tenderRes.data.tender);
        setOffers([]);
        setAnalysis({
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0,
          totalOffers: offersRes.data.total_offers || 0,
        });
        const openingDate = new Date(offersRes.data.opening_date);
        setError(`🔒 Les offres sont scellées jusqu'au ${openingDate.toLocaleDateString('fr-FR')} à ${openingDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}. Nombre d'offres reçues: ${offersRes.data.total_offers}`);
        setLoading(false);
        return;
      }

      const offersData = offersRes.data.offers || [];
      setTender(tenderRes.data.tender);
      setOffers(offersData);

      if (offersData.length > 0) {
        const prices = offersData
          .map((offer) => parseFloat(offer.total_amount) || 0)
          .filter((price) => price > 0);

        if (prices.length > 0) {
          const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
          const minPrice = Math.min(...prices).toFixed(2);
          const maxPrice = Math.max(...prices).toFixed(2);

          setAnalysis({
            avgPrice,
            minPrice,
            maxPrice,
            totalOffers: offersData.length,
          });
        }
      }
    } catch (err) {
      console.error('Erreur de chargement des offres:', err);
      setError('Échec du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (offer) => {
    setSelectedOffer(offer);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CardSkeleton count={3} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Retour
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
          Analyse des Offres
        </Typography>
        {tender && (
          <Typography variant="body1" color="textSecondary">
            {tender.title}
          </Typography>
        )}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Total des Offres
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {analysis.totalOffers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Prix Moyen
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                {analysis.avgPrice} TND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingDownIcon sx={{ color: theme.palette.success.main }} />
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Prix Minimum
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                    {analysis.minPrice} TND
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUpIcon sx={{ color: theme.palette.error.main }} />
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Prix Maximum
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                    {analysis.maxPrice} TND
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader title="Liste des Offres" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fournisseur</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Délai de Livraison</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.supplier_name || offer.company_name || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {offer.total_amount?.toLocaleString()} {offer.currency || 'TND'}
                    </Typography>
                  </TableCell>
                  <TableCell>{offer.delivery_time || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={offer.status || 'submitted'}
                      size="small"
                      color={offer.status === 'accepted' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {offer.evaluation_score ? (
                      <Chip
                        label={formatScore(offer.evaluation_score)}
                        size="small"
                        color={getScoreTier(offer.evaluation_score).color}
                      />
                    ) : (
                      'Non évalué'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={() => handleViewDetails(offer)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails de l'Offre</DialogTitle>
        <DialogContent>
          {selectedOffer && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Fournisseur
                </Typography>
                <Typography variant="body1">
                  {selectedOffer.supplier_name || selectedOffer.company_name || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Proposition Technique
                </Typography>
                <Typography variant="body1">
                  {selectedOffer.technical_proposal || 'Aucune proposition technique'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Proposition Financière
                </Typography>
                <Typography variant="body1">
                  {selectedOffer.financial_proposal || 'Aucune proposition financière'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Conditions de Paiement
                </Typography>
                <Typography variant="body1">
                  {selectedOffer.payment_terms || 'Non spécifié'}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}