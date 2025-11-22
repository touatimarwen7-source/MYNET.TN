import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, Switch, Typography } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function FeatureControl() {
  const features = [
    { name: 'Appels d\'offres généraux', enabled: true },
    { name: 'Offres directes', enabled: true },
    { name: 'Système d\'enchères', enabled: false },
    { name: 'Rapports avancés', enabled: true },
    { name: 'Forum', enabled: false },
    { name: 'API externe', enabled: false }
  ];

  useEffect(() => {
    setPageTitle('Contrôle des fonctionnalités');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          Contrôle des fonctionnalités
        </Typography>
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="Fonctionnalités disponibles" />
          <CardContent>
            <List>
              {features.map((f, idx) => (
                <ListItem key={idx} secondaryAction={<Switch checked={f.enabled} />}>
                  <ListItemText primary={f.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
