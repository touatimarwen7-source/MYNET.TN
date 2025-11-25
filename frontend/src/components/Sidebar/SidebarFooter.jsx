import { Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Sidebar footer with logout button
 */
export default function SidebarFooter({ onLogout }) {
  return (
    <Box sx={{ borderTop: '1px solid #e0e0e0', padding: '16px' }}>
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={onLogout}
        startIcon={<LogoutIcon />}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
          backgroundColor: '#c62828',
          '&:hover': { backgroundColor: '#ad1457' },
        }}
      >
        Se Déconnecter
      </Button>
    </Box>
  );
}
